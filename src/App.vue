<template>
  <tree-group :group="data"></tree-group>
</template>

<script>
  import tree from './components/tree';
  import treeGroup from './components/tree-group';
  import { Tree, TreeGroup, TreeLink } from './components/types';

  let root = new Tree('root', [
    new Tree('steve', [
      new Tree('henry'),
    ]),
    new Tree('barry', [
      new Tree('ellen'),
      new Tree('steven', [
        new Tree('wallace'),
        new Tree('hailey', [
          new Tree('horace', [
            new Tree('grace'),
            new Tree('stella', [
              new Tree('lily'),
            ])
          ]),
        ]),
      ]),
    ]),
  ]);

  let linked1 = new Tree('linked', [
    new Tree('ben'),
    new Tree('han'),
  ]);

  let linked2 = new Tree('linked2', [
    new Tree('fred'),
    new Tree('celina'),
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
