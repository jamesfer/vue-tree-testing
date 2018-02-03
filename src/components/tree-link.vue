<template>
  <div class="tree-link" :id="link.id">
    <div class="tree-spacer" v-for="i in space"></div>

    <tree-group :group="link.to"></tree-group>
  </div>
</template>

<script>
  export default {
    props: [ 'link', 'space' ],
    beforeCreate() {
      // Manually register tree group to prevent circular references.
      this.$options.components.treeGroup = require('./tree-group').default;
    },
  }
</script>

<style>
  .tree-spacer {
    height: 30px;
    padding: 5px;
  }
</style>
