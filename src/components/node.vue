<template>
  <div class="node">
    {{ name }}
  </div>
</template>

<script>
  export default {
    props: [ 'name' ],
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
