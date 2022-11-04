<script setup lang="ts">
const showForm = ref(true);
</script>
<template>
  <div>
    <NewsletterForm v-if="showForm" @on:success="showForm = false" />
    <p v-else class="text-green-600 text-center p-6">Success!</p>
  </div>
</template>