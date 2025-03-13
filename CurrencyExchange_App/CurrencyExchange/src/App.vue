<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
import FooterNav from './components/FooterNav.vue'
</script>

<template>
  <Header />
  <RouterView />
  <FooterNav />
</template>

<style scoped></style>
