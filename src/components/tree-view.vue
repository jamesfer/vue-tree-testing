<template>
  <div class="tree-view">
    <tree-group v-for="group in groups" :group="group" :key="group.id"></tree-group>
  </div>
</template>

<script>
  import treeGroup from './tree-group';
  import { debounce, wrap } from 'lodash';
  import { createFamilyTree } from '../algorithm/tree-algorithm';
  import './styles.scss';

  export default {
    props: [ 'nodes', 'links' ],
    components: {
      treeGroup,
    },
    data() {
      return {
        groups: [],
      };
    },
    watch: {
      nodes() { this.updateGroups(); },
      links() { this.updateGroups(); },
    },
    beforeCreate() {
      this.$options.methods = this.$options.methods || {};
      this.$options.methods.updateGroups = debounce(() => {
        this.groups = createFamilyTree(this.nodes, this.links);
        console.log(this.groups);
      }, 10);
    },
    created() {
      this.updateGroups();
    }
  }
</script>
