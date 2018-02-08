import { checkStructure, makeNodes, makeRels, tree, group, layer, link } from './test-utils';

describe('tree algorithm conformance', () => {
  describe('simple parent tree', () => {
    checkStructure(
      makeNodes('child', 'parent'),
      makeRels('parent', [ 'child', 'parent' ]),
      group(tree('parent', [ tree('child') ])),
    );
  });

  describe('trees linked with parents', () => {
    checkStructure(
      makeNodes('child1', 'parent1', 'child2', 'parent2'),
      [
        ...makeRels('parent', [ 'child1', 'parent1' ], [ 'child2', 'parent2' ]),
        ...makeRels('partner', [ 'parent1', 'parent2' ]),
      ],
      group(tree('parent1', [ tree('child1') ]), [
        layer([
          [ group(tree('parent2', [ tree('child2') ])), 0 ],
        ]),
      ]),
    );
  });

  describe('uneven trees linked with parents', () => {
    checkStructure(
      makeNodes('parent1', 'child2', 'parent2'),
      [
        ...makeRels('parent', [ 'child2', 'parent2' ]),
        ...makeRels('partner', [ 'parent1', 'parent2' ]),
      ],
      group(tree('parent2', [ tree('child2') ]), [
        layer([
          [ group(tree('parent1')), 0 ],
        ]),
      ]),
    );
  });

  describe('uneven trees linked with children', () => {
    checkStructure(
      makeNodes('child1', 'child2', 'parent2'),
      [
        ...makeRels('parent', [ 'child2', 'parent2' ]),
        ...makeRels('partner', [ 'child1', 'child2' ]),
      ],
      group(tree('parent2', [ tree('child2') ]), [
        layer([
          [ group(tree('child1')), 1 ],
        ]),
      ]),
    );
  });

  describe('tree with two links', () => {
    checkStructure(
      makeNodes(
        'grandparent1', 'parent1', 'child1',
        'grandparent2', 'parent2',
        'parent3', 'child3'
      ),
      [
        ...makeRels(
          'parent',
          [ 'child1', 'parent1'],
          [ 'parent1', 'grandparent1' ],
          [ 'parent2', 'grandparent2' ],
          [ 'child3', 'parent3' ],
        ),
        ...makeRels(
          'partner',
          [ 'grandparent1', 'grandparent2' ],
          [ 'parent1', 'parent3' ],
        )
      ],
      group(tree('grandparent1', [ tree('parent1', [ tree('child1') ])]), [
        layer([
          link(group(tree('grandparent2', [ tree('parent2') ])), 0)
        ], [
          link(group(tree('parent3', [ tree('child3') ])), 1)
        ]),
      ]),
    );
  });

  describe('tree with nested links', () => {
    checkStructure(
      makeNodes(
        'grandparent1', 'parent1', 'child1',
        'grandparent2', 'parent2',
        'parent3', 'child3'
      ),
      [
        ...makeRels(
          'parent',
          [ 'child1', 'parent1'],
          [ 'parent1', 'grandparent1' ],
          [ 'parent2', 'grandparent2' ],
          [ 'child3', 'parent3' ],
        ),
        ...makeRels(
          'partner',
          [ 'grandparent1', 'grandparent2' ],
          [ 'parent2', 'parent3' ],
        )
      ],
      group(tree('grandparent1', [ tree('parent1', [ tree('child1') ])]), [
        layer([
          link(group(tree('grandparent2', [ tree('parent2') ]), [
            layer([
              link(group(tree('parent3', [ tree('child3') ])), 1),
            ]),
          ]), 0),
        ]),
      ]),
    );
  });
});
