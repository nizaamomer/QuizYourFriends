<template>
    <div class=" flex-col  h-screen text-center overflow-auto bg-zinc-950 text-gray-200 relative font-ckb" dir="rtl">

        <div class="flex-col h-screen overflow-auto bg-zinc-900 text-gray-200 relative font-ckb transition-all duration-400 " dir="rtl">
            <Welcome v-if="showWelcome" @startClicked="showWelcome = false" />
            <CreateQuizzes v-else />
        </div>


    </div>
</template>
<script setup>
import { ref } from "vue"
const showWelcome = ref(true); // Set showWelcome to true by default

import Welcome from "@/components/Welcome.vue";
import CreateQuizzes from "@/components/CreateQuizzes.vue"; 
</script>
