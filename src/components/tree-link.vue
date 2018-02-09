<template>
  <div class="tree-link" :id="link.id">
    <div class="spacing">
      <div class="tree" v-for="i in space">
        <div class="node">-</div>
      </div>
    </div>

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
