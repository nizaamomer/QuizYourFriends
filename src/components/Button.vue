<template>
    <button @click.prevent="start" v-if="name"
        class="py-3 mb-2 bg-indigo-700 rounded-2xl mt-6 font-bold w-full animate-bounce ">
        با دەست پێبکەین
    </button>
</template>
<script setup>
const { start, name } = defineProps(['start', 'name']);
</script>