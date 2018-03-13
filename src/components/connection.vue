<template>
    <svg v-if="fromEl && toEl" class="connection"
         :class="slope"
         :style="{ width: width, height: height, left: left, top: top }">

        <!-- Back slash -->
        <line class="backwards" x1="0" y1="0" x2="100%" y2="100%" style="stroke-width: 1" />

        <!-- Forward slash -->
        <line class="forwards" x1="100%" y1="0" x2="0" y2="100%" style="stroke-width: 1" />

        <!-- Vertical and horizontal lines -->
        <rect class="fill" x="0" y="0" width="100%" height="100%" />
    </svg>
</template>

<script>
    import { assign } from 'lodash';

    export default {
      props: [ 'from', 'to', 'kind' ],
      data() {
        return {
          fromEl: null,
          toEl: null,
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          slope: null,
        };
      },
      watch: {
        from(newFromId) {
          this.fromEl = this.getEl(newFromId);
          this.updateCoords();
        },

        to(newToId) {
          this.toEl = this.getEl(newToId);
          this.updateCoords();
        },
      },
      methods: {
        getEl(id) {
          return this.from ? document.getElementById(`node-${id}`) : null;
        },

        updateCoords() {
          assign(this, this.getCoords());
        },

        getCoords() {
          // Find the center point of both elements
          const centerPointFrom = this.centerOf(this.fromEl);
          const centerPointTo = this.centerOf(this.toEl);

          // Copy the center points
          const pointFrom = { ...centerPointFrom };
          const pointTo = { ...centerPointTo };
          switch (this.kind) {
            case 'parent':
              // Check if from point is above or below the to point
              if (centerPointFrom.y < centerPointTo.y) {
                pointFrom.y += this.fromEl.offsetHeight / 2;
                pointTo.y -= this.toEl.offsetHeight / 2;
              } else {
                pointFrom.y -= this.fromEl.offsetHeight / 2;
                pointTo.y += this.toEl.offsetHeight / 2;
              }
              break;

            case 'partner':
              // Check if partner is to the left or right of the to point
              if (centerPointFrom.x < centerPointTo.x) {
                pointFrom.x += this.fromEl.offsetWidth / 2;
                pointTo.x -= this.toEl.offsetWidth / 2;
              } else {
                pointFrom.x -= this.fromEl.offsetWidth / 2;
                pointTo.x += this.toEl.offsetWidth / 2;
              }
              break;
          }

          // Calculate the offset's of the line element and the gradient
          const left = Math.min(pointFrom.x, pointTo.x);
          const top = Math.min(pointFrom.y, pointTo.y);
          const width = Math.max(Math.max(pointFrom.x, pointTo.x) - left, 1);
          const height = Math.max(Math.max(pointFrom.y, pointTo.y) - top, 1);
          const gradient = (pointTo.y - pointFrom.y) / (pointTo.x - pointFrom.x);
          const slope = Math.abs(pointFrom.x - pointTo.x) <= 2 ? 'vertical'
            : Math.abs(pointFrom.y - pointTo.y) <= 2 ? 'horizontal'
            : gradient < 0 ? 'forwards'
              : 'backwards';

          return { left, top, width, height, slope };
        },

        centerOf(el) {
          return {
            x: el.offsetLeft + el.offsetWidth / 2,
            y: el.offsetTop + el.offsetHeight / 2,
          };
        },
      },
      mounted() {
        this.fromEl = this.getEl(this.from);
        this.toEl = this.getEl(this.to);
        this.updateCoords();
      }
    };
</script>
