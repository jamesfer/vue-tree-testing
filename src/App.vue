<template>
  <div>
    <tree-view :nodes="nodes" :links="links"></tree-view>
    <div class="col">
      <textarea name="nodes" id="nodes" v-model="nodesText"></textarea>
    </div><div class="col">
      <textarea name="links" id="links" v-model="linksText"></textarea>
    </div>
  </div>
</template>

<style>
  .col {
    width: 50%;
    box-sizing: border-box;
    padding: 10px;
    display: inline-block;
  }

  .col textarea {
    width: 100%;
    height: 100px;
  }
</style>

<script>
  import treeView from './components/tree-view';
  import { Tree, TreeGroup, TreeLink, Node } from './components/types';

//  const root = new Tree(new Node('root'), [
//    new Tree(new Node('steve'), [
//      new Tree(new Node('henry')),
//    ]),
//    new Tree(new Node('barry'), [
//      new Tree(new Node('ellen')),
//      new Tree(new Node('steven'), [
//        new Tree(new Node('wallace')),
//        new Tree(new Node('hailey'), [
//          new Tree(new Node('horace'), [
//            new Tree(new Node('grace')),
//            new Tree(new Node('stella'), [
//              new Tree(new Node('lily')),
//            ])
//          ]),
//        ]),
//      ]),
//    ]),
//  ]);
//
//  const linked1 = new Tree(new Node('linked'), [
//    new Tree(new Node('ben')),
//    new Tree(new Node('han')),
//  ]);
//
//  const linked2 = new Tree(new Node('linked2'), [
//    new Tree(new Node('fred')),
//    new Tree(new Node('celina')),
//  ]);
//
//  const data = new TreeGroup(root, [
//    new TreeLink(new TreeGroup(linked1), 1),
//    new TreeLink(new TreeGroup(linked2), 4),
//  ]);

  const defaultNodes = [
    { name: 'grandparent' },
    { name: 'parent' },
    { name: 'child1' },
    { name: 'child2' },
    { name: 'otherParent' },
    { name: 'child1 partner' },
  ];

  const defaultLinks = [
    { kind: 'parent', from: 'child1', to: 'parent' },
    { kind: 'parent', from: 'child2', to: 'parent' },
    { kind: 'parent', from: 'parent', to: 'grandparent' },
    { kind: 'parent', from: 'child1 partner', to: 'otherParent' },
  ];

  export default {
    components: {
      treeView,
    },
    data() {
      return {
        nodesText: '',
        linksText: '',
        nodes: [],
        links: [],
      };
    },
    watch: {
      nodesText(value) { this.nodes = JSON.parse(value); },
      linksText(value) { this.links = JSON.parse(value); },
    },
    created() {
      this.nodesText = JSON.stringify(defaultNodes);
      this.linksText = JSON.stringify(defaultLinks);
    }
  };
</script>
