<template>
  <div class="tree-group" :id="group.id">
    <div class="left-links">
      <div class="link-layer" v-for="layer in reverse(group.layers)">
        <tree-link v-for="link in getLayerSections(layer.leftLinks)" :key="section.link.id" :space="section.spaceSize" :link="section.link"></tree-link>
      </div>
    </div>

    <tree :tree="group.root"></tree>

    <div class="right-links">
      <div class="link-layer" v-for="layer in group.layers">
        <tree-link v-for="section in getLayerSections(layer.rightLinks)" :key="section.link.id" :space="section.spaceSize" :link="section.link"></tree-link>
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

      /**
       *
       * @param {TreeLink[]} links
       * @returns {{ link: TreeLink, spaceSize: number }[]}
       */
      getLayerSections(links) {
        const orderedLinks = sortBy(links, 'verticalOffset');

        let previousOffset = 0;
        return map(orderedLinks, link => {
          let spaceSize = link.verticalOffset - previousOffset;

          // Throw an error if space is too small
          if (spaceSize < 0) {
            spaceSize = 0;
            throw new Error('There is not enough room to render all links.');
          }

          // Update the previous offset
          previousOffset += spaceSize + link.getHeight();

          return { link, spaceSize };
        });
      }
    },
  }
</script>

