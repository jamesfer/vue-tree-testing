<template>
  <div class="node" :id="`node-${node.id}`">
    {{ node.name }}
  </div>
</template>

<script>
  export default {
    props: [ 'node' ],
  }
</script>
