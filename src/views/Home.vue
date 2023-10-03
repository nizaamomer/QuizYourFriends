<template>
    <div class=" flex-col  h-screen text-center overflow-auto bg-zinc-950 text-gray-200 transition-all duration-400 relative font-ckb"
        id="home" dir="rtl">
        <Welcome v-if="showWelcome && !haveQuistion" @startClicked="showWelcome = false" />
        <CreateQuizzes v-else-if="!showWelcome && !haveQuistion" @haveQuistion="haveQuistion = true" />
        <Dashboard v-if="haveQuistion && !showWelcome" @haveQuistion="haveQuistion = false" />
        <Footer />
       
    </div>
</template>
<script setup>
import Welcome from "@/components/Welcome.vue";
import CreateQuizzes from "@/components/CreateQuizzes.vue";
import Dashboard from "@/components/Dashboard.vue";
import Footer from "@/components/Footer.vue";
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router";
import db from '@/firebase';
import { collection, doc, onSnapshot } from 'firebase/firestore';
const showWelcome = ref(true);
const haveQuistion = ref(false);
const route = useRoute();
const router = useRouter();
const quizzesCollection = collection(db, 'Quizzes');
const myQuizId = localStorage.getItem("myQuizId")
const quizId = route.params.id;
onMounted(async () => {
    if (quizId === myQuizId) {
        router.push({ name: 'home' })
    }
    if (myQuizId) {
        const docRef = doc(quizzesCollection, myQuizId);
        onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                haveQuistion.value = true;
                showWelcome.value = false;
            } else {
                haveQuistion.value = false;
                showWelcome.value = true;
            }
        });
    } else {
        haveQuistion.value = false;
        showWelcome.value = true;
    }
});
</script>
