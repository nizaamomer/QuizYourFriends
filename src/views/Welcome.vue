<template>
    <label for="name">Name:</label>
    <input type="text" v-model="name" id="name" class="border mx-auto" autofocus>
    <router-link @click.prevent="start" :class="{ 'hidden': !name }" :to="{ name: 'quizes.create' }">با دەستپێبکەین
    </router-link>
</template>
<script setup>
import { ref } from "vue";
const name = ref(localStorage.getItem('name') || "");
const start = () => {
    localStorage.setItem("name", name.value);
};
</script>
  