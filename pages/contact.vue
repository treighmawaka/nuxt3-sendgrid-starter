<script setup lang="ts">
const showForm = ref(true);
</script>
<template>
  <div>
    <ContactForm v-if="showForm" @on:success="showForm = false" />
    <p v-else class="text-green-600 text-center p-6">Message sent!</p>
  </div>
</template>