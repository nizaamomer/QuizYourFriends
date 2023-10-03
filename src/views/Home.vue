<template>
    <div class=" flex-col  h-screen text-center overflow-auto bg-zinc-950 text-gray-200 relative font-ckb" dir="rtl">
        <div class="flex-col h-screen overflow-auto bg-zinc-900 text-gray-200 relative font-ckb transition-all duration-400 "
            dir="rtl">
            <Welcome v-if="showWelcome && !haveQuistion" @startClicked="showWelcome = false" />
            <CreateQuizzes v-else-if="!showWelcome && !haveQuistion " />
            <Dashboard v-if="haveQuistion" />
            <Footer />
            
        </div>
    </div>
</template>
<script setup>
import Welcome from "@/components/Welcome.vue";
import CreateQuizzes from "@/components/CreateQuizzes.vue";
import Dashboard from "@/components/Dashboard.vue";
import Footer from "@/components/Footer.vue";
import { ref } from "vue"
const showWelcome = ref(true);
const haveQuistion = ref(false);
const myQuizId = localStorage.getItem("yourQuizId")

if (myQuizId) {
    haveQuistion.value = true;
    showWelcome.value = false;
} else {
    haveQuistion.value = false;
    showWelcome.value = true;

}
</script>
