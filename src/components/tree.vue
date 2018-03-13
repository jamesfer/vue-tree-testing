<template>
  <div class="tree" :id="`tree-${tree.id}`">
    <node :node="tree.node"></node>

    <div class="children">
      <tree v-for="child in tree.children" :key="child.id" :tree="child"></tree>
    </div>

    <connection v-for="child in tree.children" kind="parent" :from="tree.node.id" :to="child.id"></connection>
  </div>
</template>

<script>
  import node from './node';
  import connection from './connection';

  export default {
    name: 'tree',
    props: [ 'tree' ],
    components: {
      node,
      connection,
    }
  }
</script>
