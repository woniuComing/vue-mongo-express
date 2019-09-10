<template lang='html'>
  <div id="app">
      <!-- <layout></layout>-->
    <router-view></router-view>
  </div>
</template>

<script>
// import Login from './components/login/index.vue'
import layout from './components/layout/index.vue'
export default {
  name: 'app',
  components: {
    //   layout
    // Login
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
