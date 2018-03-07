<template>
  <div class="tree" :id="`tree-${tree.id}`">
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
