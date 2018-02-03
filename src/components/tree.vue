<template>
  <div class="tree" :id="tree.id">
    <node :node="tree.node"></node>

    <div class="children">
      <tree v-for="child in tree.children" :key="child.id" :tree="child"></tree>
    </div>
  </div>
</template>

<script>
  import node from './node';

  export default {
    name: 'tree',
    props: [ 'tree' ],
    components: {
      node,
    }
  }
</script>

<style>
  .tree {
    text-align: center;
    display: inline-block;
    vertical-align: top;
    padding: 10px 10px 0;
  }
</style>
