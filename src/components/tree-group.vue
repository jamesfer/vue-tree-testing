<template>
  <div class="tree-group" :id="group.id">
    <div class="left-links">
      <div class="link-layer" v-for="layer in reverse(group.layers)">
        <tree-link v-for="link in layer.leftLinks" :key="link.id" :space="link.verticalOffset" :link="link"></tree-link>
      </div>
    </div>

    <tree :tree="group.root"></tree>

    <div class="right-links">
      <div class="link-layer" v-for="layer in group.layers">
        <tree-link v-for="link in layer.rightLinks" :key="link.id" :space="link.verticalOffset" :link="link"></tree-link>
      </div>
    </div>
  </div>
</template>

<script>
  import tree from './tree';
  import treeLink from './tree-link';
  import { sortBy, map, reverse } from 'lodash';

  export default {
    props: [ 'group' ],
    components: {
      tree,
      treeLink,
    },
    methods: {
      reverse,
    },
  }
</script>

<style>
  .tree-group {
    white-space: nowrap;
    overflow: scroll;
  }

  .left-links, .right-links {
    display: inline-block;
  }
</style>
