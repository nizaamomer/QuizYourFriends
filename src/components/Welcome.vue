<template>
    <div
        class="w-full mx-auto space-y-20   max-w-xl font-ckb  bg-transparent border border-transparent text-gray-100 rounded-3xl  px-4 md:px-8 text-lg font-semibold ">
        <textarea v-model.trim="name" maxlength="16"
            class="bg-transparent text-base pt-3 border-[2.8px] text-right resize-none outline-none focus:outline-none focus:border-blue-800 hover:border-blue-800 whitespace-pre-wrap border-zinc-700 rounded-2xl w-full px-4 h-[100px]"></textarea>
        <span class="text-gray-400 text-xs absolute left-7 bottom-8">{{ name.length + "/16" }}</span>
        <router-link @click.prevent="start" :class="{ 'hidden': !name }" :to="{ name: 'quizes.create' }">با دەستپێبکەین
        </router-link>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router"

const router = useRouter()
const name = ref(localStorage.getItem('name') || "");
const start = () => {
    localStorage.setItem("name", name.value);
};
onMounted(() => {
    if (localStorage.getItem("yourQuizId")) {
        router.push({ name: 'quizes.copy' })
    }
})
</script>
  