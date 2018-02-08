<template>
  <div class="section">
    <div class="container">
      <div class="content">
        <tree-view :nodes="nodes" :links="links"></tree-view>
      </div>
      <div class="content">
        <edit-tree @change="change()" :nodes="nodes" :links="links"></edit-tree>
      </div>
    </div>
  </div>
</template>

<script>
  import treeView from '../components/tree-view';
  import editTree from './edit-tree';
  import { Tree, TreeGroup, TreeLink, Node } from '../algorithm/types';

  const defaultNodes = [
    { name: 'grandparent' },
    { name: 'parent' },
    { name: 'child1' },
    { name: 'child2' },
    { name: 'otherParent' },
    { name: 'child1 partner' },
    { name: 'another child' },
  ];

  const defaultLinks = [
    { kind: 'parent', from: 'child2', to: 'parent' },
    { kind: 'parent', from: 'child1', to: 'parent' },
    { kind: 'parent', from: 'parent', to: 'grandparent' },
    { kind: 'parent', from: 'child1 partner', to: 'otherParent' },
    { kind: 'partner', from: 'child1 partner', to: 'child1', children: [ 'another child' ] },
    { kind: 'parent', from: 'another child', to: 'child1 partner' },
  ];

  export default {
    components: {
      treeView,
      editTree,
    },
    data() {
      return {
        nodesText: '',
        linksText: '',
        nodes: defaultNodes,
        links: defaultLinks,
      };
    },
    methods: {
      change() {
        this.nodes = [ ...this.nodes ];
        this.links = [ ...this.links ];
      },
    },
  };
</script>
