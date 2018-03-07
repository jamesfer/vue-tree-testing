<template>
  <div class="node" :id="node.id">
    {{ node.name }}
  </div>
</template>

<script>
  export default {
    props: [ 'node' ],
  }
</script>
