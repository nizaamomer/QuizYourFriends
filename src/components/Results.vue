<template>
    <div class="bg-bgray rounded-2xl text-center  py-4 my-5 px-8 text-gray-300" dir="ltr">
        <h1 class="text-center text-indigo-400 text-xl my-2">{{ title }}</h1>
        <div class="flex justify-between items-center">
            <div class="px-6 py-3">
                وەڵامی ڕاست
            </div>
            <div class="px-6 py-3">
                ناو
            </div>
        </div>
        <div v-for="friend in friends" :key="friend.id"
            class="flex justify-between items-center border-b border-dotted border-gray-400 bg-zinc-900 rounded">
            <div class="px-8 py-3 text-yellow-500">
                {{ friend.correctResult }}<span class="text-gray-400">/10</span>
            </div>
            <div class="px-6 py-3">
                {{ friend.name }}
            </div>
        </div>
    </div>
</template>
  
<script setup>

const { friends, title } = defineProps(['friends', 'title']);
</script>
  