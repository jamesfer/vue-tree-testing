<template>
  <div class="node">
    {{ node.name }}
  </div>
</template>

<script>
  export default {
    props: [ 'node' ],
  }
</script>

<style>
  .node {
    width: 100px;
    border: 1px solid black;
    padding: 5px;
    display: inline-block;
  }
</style>
