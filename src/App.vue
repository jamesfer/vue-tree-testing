<template>
  <div id="app">
    <h1>{{title}}</h1>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      title: 'Hello, Vue!'
    };
  }
};
</script>

<style>
h1 {
  color: #42b883;
}
</style>
