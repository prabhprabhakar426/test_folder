<template>
  <div id="app">
    <div class="content">
    <router-view />
    </div>
  </div>
</template>

<script>
// import MenuOption from './components/MenuOption.vue';


export default {
  name: 'App',
  components:{
    // MenuOption
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.layout {
  display: flex;
}


</style>
