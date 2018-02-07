import { map } from 'lodash';
import { createFamilyTree, createTreeStructure } from './tree-algorithm';

function makeNodes(...names) {
  return map(names, name => ({ name }));
}

function makeRels(kind, ...rels) {
  return map(rels, rel => ({ kind, from: rel[0], to: rel[1] }));
}

describe('createTreeStructure()', () => {
  it('should create child-parent relationships', () => {
    const nodes = makeNodes('a', 'b');
    const rels = makeRels('parent', [ 'b', 'a' ]);

    const trees = createTreeStructure(nodes, rels);
    expect(trees.length).toBe(1);
    expect(trees[0].node.name).toBe('a');
    expect(trees[0].children.length).toBe(1);
    expect(trees[0].children[0].node.name).toBe('b');
  });

  it('should throw if a child has more than one parent', () => {
    const nodes = makeNodes('a', 'b', 'c');
    const rels = makeRels('parent', [ 'b', 'a' ], [ 'b', 'c' ]);

    expect(() => createTreeStructure(nodes, rels)).toThrow();
  });

  it('should throw an error on cyclical relationships', () => {
    const nodes = makeNodes('a', 'b');
    const rels = makeRels('parent', [ 'b', 'a' ], [ 'a', 'b' ]);

    expect(() => createTreeStructure(nodes, rels)).toThrow();
  });
});

describe('createFamilyTree()', () => {
  it('should maintain direction of partnership when trees are the same height', () => {
    const nodes = makeNodes('child', 'childsPartner');
    const rels = [
      ...makeRels('partner', [ 'child', 'childsPartner' ]),
    ];

    const groups = createFamilyTree(nodes, rels);
    expect(groups.length).toBe(1);
    expect(groups[0].childLinks.length).toBe(1);
    expect(groups[0].childLinks[0].to.root.node.name).toBe('childsPartner');
  });

  it('should link deeper nodes to shallower ones', () => {
    const nodes = makeNodes('parent', 'child', 'childsPartner');
    const rels = [
      ...makeRels('parent', [ 'child', 'parent' ]),
      ...makeRels('partner', [ 'childsPartner', 'child' ]),
    ];

    const groups = createFamilyTree(nodes, rels);
    expect(groups.length).toBe(1);
    expect(groups[0].root.node.name).toBe('parent');
    expect(groups[0].childLinks.length).toBe(1);
    expect(groups[0].childLinks[0].to.root.node.name).toBe('childsPartner');
  });

  it('should link larger trees to smaller ones', () => {
    const nodes = makeNodes('parent', 'child', 'parentsPartner');
    const rels = [
      ...makeRels('parent', [ 'child', 'parent' ]),
      ...makeRels('partner', [ 'parentsPartner', 'parent' ]),
    ];

    const groups = createFamilyTree(nodes, rels);
    expect(groups.length).toBe(1);
    expect(groups[0].root.node.name).toBe('parent');
    expect(groups[0].childLinks.length).toBe(1);
    expect(groups[0].childLinks[0].to.root.node.name).toBe('parentsPartner');
  });

  it('should return multiple root groups', () => {
    const nodes = makeNodes('personA', 'personB');
    const rels = [];

    const groups = createFamilyTree(nodes, rels);
    expect(groups.length).toBe(2);
  });
});
