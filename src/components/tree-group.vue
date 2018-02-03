<template>
  <div class="tree-group" :id="group.id">
    <tree :tree="group.root"></tree>

    <div class="right-links">
      <tree-link v-for="link in rightLinks" :key="link.id" :space="link.spaceSize" :link="link.link"></tree-link>
    </div>
  </div>
</template>

<script>
  import tree from './tree';
  import treeLink from './tree-link';
  import { sortBy, map } from 'lodash';

  export default {
    props: [ 'group' ],
    components: {
      tree,
      treeLink,
    },
    computed: {
      leftLinks() {
        return this.calculateSpaceSize(this.group.leftLinks);
      },

      rightLinks() {
        return this.calculateSpaceSize(this.group.rightLinks);
      }
    },
    methods: {
      calculateSpaceSize(links) {
        const orderedLinks = sortBy(links, 'verticalOffset');

        let previousOffset = 0;
        return map(orderedLinks, link => {
          let spaceSize = link.verticalOffset - previousOffset;
          console.log('space size', spaceSize);

          // Throw an error if space is too small
          if (spaceSize < 0) {
            spaceSize = 0;
            throw new Error('There is not enough room to render all links.');
          }

          // Update the previous offset
          previousOffset += spaceSize + link.getHeight();
          console.log('next space size', previousOffset);

          return { link, spaceSize };
        })
      }
    }
  }
</script>

<style>
  .tree-group {
    white-space: nowrap;
    overflow: scroll;
  }

  .right-links {
    display: inline-block;
  }
</style>
