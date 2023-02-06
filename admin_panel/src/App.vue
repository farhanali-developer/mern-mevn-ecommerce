<script setup>
import { RouterView } from 'vue-router'
import productsCrud from './modules/productsCrud'
</script>

<template>
  <Navbar />
  <div class="container h-100">
    <RouterView />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
export default{
  data(){
    return {
      user: null
    }
  }
}
</script>

<style scoped>
</style>
