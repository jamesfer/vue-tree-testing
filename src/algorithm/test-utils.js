import { map, zip, find, each } from 'lodash';
import { createFamilyTree } from './tree-algorithm';
import { Node, Tree, TreeGroup, TreeLink, TreeLinkLayer } from './types';

export function makeNodes(...names) {
  return map(names, name => ({ name }));
}

export function makeRels(kind, ...rels) {
  return map(rels, rel => ({ kind, from: rel[0], to: rel[1] }));
}

/**
 * Shortcut to create a new tree
 * @param {Tree|Node|string} node
 * @param {(Tree|Node|string)[]} children {
 * @return Tree
 */
export function tree(node, children = []) {
  if (node instanceof Tree) {
    return node;
  }

  if (typeof node === 'string') {
    node = new Node(node);
  }

  return new Tree(node, map(children, tree));
}

/**
 * Shortcut to create a tree group
 * @param {TreeGroup|Tree|Node|string} newTree
 * @param {(TreeLinkLayer|[ TreeLink[], TreeLink[] ])[]} layers
 */
export function group(newTree, layers = []) {
  if (newTree instanceof TreeGroup) {
    return newTree;
  }

  newTree = tree(newTree);

  if (layers.length > 0 && layers[0] instanceof Array) {
    layers = map(layers, layer => new TreeLinkLayer(...layer));
  }

  return new TreeGroup(newTree, layers);
}

/**
 * Shortcut to create a tree link layer.
 * @param {(TreeLink|[ TreeGroup, number ])[]} rightLinks
 * @param {(TreeLink|[ TreeGroup, number ])[]} leftLinks
 * @returns {TreeLinkLayer}
 */
export function layer(rightLinks = [], leftLinks = []) {
  let normalizeLink = link => {
    if (link instanceof Array) {
      return new TreeLink(...link);
    }
    return link;
  };

  rightLinks = map(rightLinks, normalizeLink);
  leftLinks = map(leftLinks, normalizeLink);
  return new TreeLinkLayer(rightLinks, leftLinks);
}

/**
 * Shortcut to create a tree link.
 * @param {TreeGroup} treeGroup
 * @param {number} offset
 * @return {TreeLink}
 */
export function link(treeGroup, offset) {
  return new TreeLink(treeGroup, offset);
}


/**
 *
 * @param {Tree} expected
 * @param {Tree} actual
 */
function checkTreeStructure(expected, actual) {
  describe(`tree ${expected.node.name}`, () => {
    expect(expected.node.name).toBe(actual.node.name);

    it(`should have ${expected.children.length} children`, () => {
      expect(actual.children.length).toBe(expected.children.length);
    });

    each(expected.children, expectedChild => {
      // Attempt to find the child in the actual list
      const actualChild = find(actual.children, actualChild => {
        return actualChild.node.name === expectedChild.node.name;
      });

      it(`should have a child node named ${expectedChild.node.name}`, () => {
        expect(actualChild).toBeTruthy();
      });

      if (actualChild) {
        checkTreeStructure(expectedChild, actualChild);
      }
    });
  });
}

/**
 *
 * @param {TreeLink} expectedLink
 * @param {TreeLink} actualLink
 * @param {number} index
 */
function checkLinkStructure(expectedLink, actualLink, index) {
  describe(`link ${index}`, () => {
    it('should have the correct vertical offset', () => {
      expect(actualLink.verticalOffset)
        .toBe(expectedLink.verticalOffset);
    });

    // Check the child tree structure
    checkGroupStructure(expectedLink.to, actualLink.to);
  });
}

/**
 *
 * @param {TreeLink[]} expectedLinks
 * @param {TreeLink[]} actualLinks
 */
function checkLayerLinksStructure(expectedLinks, actualLinks) {
  it(`should have ${expectedLinks.length} links`, () => {
    expect(actualLinks.length).toBe(expectedLinks.length);
  });

  each(expectedLinks, (expectedLink, index) => {
    // Attempt to find a matching link in the actual layer
    const actualLink = find(actualLinks, link => {
      return link.to.root.node.name === expectedLink.to.root.node.name;
    });

    it(`should have a link to ${expectedLink.to.root.node.name}`, () => {
      return expect(actualLink).toBeTruthy();
    });

    if (actualLink) {
      checkLinkStructure(expectedLink, actualLink, index);
    }
  });
}

/**
 *
 * @param {TreeLinkLayer} expectedLayer
 * @param {TreeLinkLayer} actualLayer
 * @param {number} index
 */
function checkLayerStructure(expectedLayer, actualLayer, index) {
  describe(`layer ${index}`, () => {
    describe('right', () => {
      checkLayerLinksStructure(expectedLayer.rightLinks, actualLayer.rightLinks);
    });

    describe('left', () => {
      checkLayerLinksStructure(expectedLayer.leftLinks, actualLayer.leftLinks);
    });
  });
}

/**
 *
 * @param {TreeGroup} expectedGroup
 * @param {TreeGroup} actualGroup
 */
function checkGroupStructure(expectedGroup, actualGroup) {
  describe(`tree group ${expectedGroup.root.node.name}`, () => {
    // Assert the root tree structure is correct
    checkTreeStructure(expectedGroup.root, actualGroup.root);

    // Assert that the number of layers is correct
    it(`should have ${expectedGroup.layers.length} layers`, () => {
      expect(actualGroup.layers.length).toBe(expectedGroup.layers.length);
    });

    // Assert that each layer is correct
    const zippedLayers = zip(expectedGroup.layers, actualGroup.layers);
    each(zippedLayers, ([ expectedLayer, actualLayer ], index) => {
      if (expectedLayer && actualLayer) {
        checkLayerStructure(expectedLayer, actualLayer, index);
      }
    });
  });
}

/**
 *
 * @param {object[]} nodes
 * @param {object[]} rels
 * @param {TreeGroup} expectedGroups
 */
export function checkStructure(nodes, rels, ...expectedGroups) {
  // Run the algorithm
  const groups = createFamilyTree(nodes, rels);

  it(`should produce ${expectedGroups.length} groups`, () => {
    expect(groups.length).toBe(expectedGroups.length);
  });

  // Loop through each group
  each(zip(expectedGroups, groups), ([ expectedGroup, actualGroup ]) => {
    if (expectedGroup && actualGroup) {
      checkGroupStructure(expectedGroup, actualGroup);
    }
  });
}
