<template>
  <div id="app">
    <Header></Header>
    <br><br>
    <router-view/>
    <br><br>
    <Footer/>
  </div>
</template>

<script>
  import Header from "./components/header/header";
  import Footer from "./components/footer/footer";
  export default {
    components: {Footer, Header,}
  }
</script>

<style>
#app {
  margin-top: 60px
}
</style>
