<template>
  <tree-group :group="data"></tree-group>
</template>

<script>
  import tree from './components/tree';
  import treeGroup from './components/tree-group';
  import { Tree, TreeGroup, TreeLink, Node } from './components/types';

  const root = new Tree(new Node('root'), [
    new Tree(new Node('steve'), [
      new Tree(new Node('henry')),
    ]),
    new Tree(new Node('barry'), [
      new Tree(new Node('ellen')),
      new Tree(new Node('steven'), [
        new Tree(new Node('wallace')),
        new Tree(new Node('hailey'), [
          new Tree(new Node('horace'), [
            new Tree(new Node('grace')),
            new Tree(new Node('stella'), [
              new Tree(new Node('lily')),
            ])
          ]),
        ]),
      ]),
    ]),
  ]);

  const linked1 = new Tree(new Node('linked'), [
    new Tree(new Node('ben')),
    new Tree(new Node('han')),
  ]);

  const linked2 = new Tree(new Node('linked2'), [
    new Tree(new Node('fred')),
    new Tree(new Node('celina')),
  ]);

  const data = new TreeGroup(root, [
    new TreeLink(new TreeGroup(linked1), 1),
    new TreeLink(new TreeGroup(linked2), 4),
  ]);

  export default {
    components: {
      tree,
      treeGroup,
    },
    data() {
      return { data };
    }
  };
</script>
