import { reduce, each, some, every, pickBy, values, reject, map, sortBy } from 'lodash';
import {
  Tree, Node, TreeGroup, TreeLink,
  TreeLinkLayer,
} from './components/types';

const nodes = [
  { name: 'grandparent' },
  { name: 'parent' },
  { name: 'child1' },
  { name: 'child2' },
  { name: 'otherParent' },
  { name: 'child1 partner' },
];

const links = [
  { kind: 'parent', from: 'a', to: 'b' },
  { kind: 'parent', from: 'b', to: 'c' },
  { kind: 'parent', from: 'c', to: 'd' },
];


/**
 * Creates a map of trees from single nodes. Each tree will have no children
 * and the root of the tree will be the node.
 * @param {array} nodes
 * @return {object}
 */
function createTrees(nodes) {
  return reduce(nodes, (nodeMap, node) => {
    node = new Node(node.id || node.name, node.name);
    nodeMap[node.id] = new Tree(node);
    return nodeMap;
  }, {});
}


/**
 * Returns the two trees that have the `to` and `from` nodes of the relationship
 * as their roots.
 * @param nodeMap
 * @param rel
 * @returns {[ Tree, Tree ]}
 */
function findRelatedTrees(nodeMap, rel) {
  const fromTree = nodeMap[rel.from];
  if (!fromTree) {
    throw new Error(`Could not find a source tree with the id ${rel.from}`);
  }

  const toTree = nodeMap[rel.to];
  if (!toTree) {
    throw new Error(`Could not find a dest tree with the id ${rel.to}`);
  }

  return [ fromTree, toTree ];
}


/**
 * Loops through all parent relations and adds the child to it's parent tree.
 * @param {object} nodeMap
 * @param {array} rels
 */
function processParentRels(nodeMap, rels) {
  each(rels, rel => {
    if (rel.kind === 'parent') {
      const [ fromTree, toTree ] = findRelatedTrees(nodeMap, rel);

      if (fromTree.parent) {
        throw new Error(`Tree ${rel.from} already has a parent`);
      }

      if (toTree.hasAncestor(fromTree)) {
        throw new Error('Tree structure is an cyclical');
      }

      toTree.addChild(fromTree);
    }
  });
}


/**
 * Extracts all trees with no parent from the node map.
 * @param {object} treeMap
 * @returns {Tree[]}
 */
function extractDistinctTrees(treeMap) {
  return pickBy(treeMap, tree => tree.parent === null);
}


/**
 * Creates a list of groups from distinct trees in the node map.
 * @param {object} nodeMap
 * @return {Tree[]}
 */
function createTreeGroups(nodeMap) {
  const distinctTrees = extractDistinctTrees(nodeMap);
  return map(distinctTrees, tree => new TreeGroup(tree));
}


/**
 * Loops through each partner rel and attempts to link their groups together.
 * Each node must belong to a group.
 * @param nodeMap
 * @param rels
 */
function processPartnerRels(nodeMap, rels) {
  each(rels, rel => {
    if (rel.kind === 'partner') {
      const [ fromTree, toTree ] = findRelatedTrees(nodeMap, rel);

      if (fromTree.hasAncestor(toTree) || toTree.hasAncestor(fromTree)) {
        throw new Error(`Partner relationship can't link two nodes from the same family (${rel.from}, ${rel.to})`);
      }

      const fromGroup = fromTree.getGroup();
      const toGroup = toTree.getGroup();

      if (!fromGroup || !toGroup) {
        throw new Error(`Attempting to link two trees in a partnership without a group (${rel.from}, ${rel.to})`)
      }

      const fromHeight = fromTree.getDepth();
      const toHeight = toTree.getDepth();
      if (fromHeight > toHeight) {
        fromGroup.addLink(new TreeLink(toGroup, fromHeight - toHeight));
      }
      else if (fromHeight < toHeight) {
        toGroup.addLink(new TreeLink(fromGroup, toHeight - fromHeight));
      }
      else {
        // The two nodes are the same distance from their roots, so attempt
        // to link from the larger tree to the smaller.
        const fromTreeHeight = fromTree.getRoot().getHeight();
        const toTreeHeight = toTree.getRoot().getHeight();

        if (fromTreeHeight >= toTreeHeight) {
          fromGroup.addLink(new TreeLink(toGroup, fromHeight - toHeight));
        }
        else if (fromTreeHeight < toTreeHeight) {
          toGroup.addLink(new TreeLink(fromGroup, toHeight - fromHeight));
        }
      }
    }
  });
}


/**
 * Extracts groups that have no parent links
 * @param {TreeGroup[]} groups
 * @return {TreeGroup[]}
 */
function getRootGroups(groups) {
  return reject(groups, group => group.hasParent());
}


/**
 * Returns true if there is room for a new link in the current list of links.
 * @param {TreeLink[]} links
 * @param {number} offset
 * @param {number} height
 */
function isRoomInLayer(links, offset, height) {
  return every(links, link => {
    return offset + height < link.verticalOffset
    || offset >= link.verticalOffset + link.getHeight();
  });
}


/**
 * Attempts to add a child link to a layer. Returns true if it found a spot.
 * @param {TreeLinkLayer} layer
 * @param {TreeLink} link
 * @returns {boolean}
 */
function addLinkToLayer(layer, link) {
  const offset = link.verticalOffset;
  const height = link.getHeight();

  // Check if there is room on the right first
  if (isRoomInLayer(layer.rightLinks, offset, height)) {
    layer.rightLinks.push(link);
    return true;
  }

  // Then check the left
  if (isRoomInLayer(layer.leftLinks, offset, height)) {
    layer.leftLinks.push(link);
    return true;
  }

  return false
}


/**
 * Creates a list of layers that govern how to lay relations out for each of
 * the given groups.
 * @param {TreeGroup[]} groups.
 */
function createGroupLayers(groups) {
  each(groups, group => {
    // Sort the links from smallest to largest
    const sortedLinks = sortBy(group.childLinks, link => link.getHeight());

    each(sortedLinks, link => {
      // Attempt to fit the link into an existing layer, starting with the
      // inner most layers
      const linkDidFit = some(group.layers, layer => {
        return addLinkToLayer(layer, link);
      });

      if (!linkDidFit) {
        // Add the link to a new layer
        const newLayer = new TreeLinkLayer(group);
        addLinkToLayer(newLayer, link);
      }
    });
  });
}


/**
 * @return {Tree[]}
 */
export function createTreeStructure(nodes, links) {
  const treeMap = createTrees(nodes);
  processParentRels(treeMap, links);
  return values(extractDistinctTrees(treeMap));
}


export function createFamilyTree(nodes, links) {
  const treeMap = createTrees(nodes);
  processParentRels(treeMap, links);

  const groups = createTreeGroups(treeMap);
  processPartnerRels(treeMap, links);

  const rootGroups = getRootGroups(groups);
  if (rootGroups.length === 0) {
    throw new Error('Cyclical graphs cannot be processed');
  }
  return rootGroups;
}


