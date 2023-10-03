<template>
    <div class=" flex-col  h-screen text-center overflow-auto  bg-zinc-950 transition-all duration-400  text-gray-200 relative font-ckb"
        dir="rtl">

        <FriendName v-if="showFriend && !haveAnswered" @friendClicked="showFriend = false" />
        <AnswerQuizzes v-else-if="!showFriend && !haveAnswered" @beforeExistsId="haveAnswered = false" />
        <AnswerResult v-if="haveAnswered && !showFriend" />
        <Footer />
    </div>
</template>
<script setup>
import FriendName from "@/components/FriendName.vue";
import AnswerQuizzes from "@/components/AnswerQuizzes.vue";
import AnswerResult from "@/components/AnswerResult.vue";
import Footer from "@/components/Footer.vue";
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router";
import db from '@/firebase';
import { collection, doc, onSnapshot } from 'firebase/firestore';
const quizzesCollection = collection(db, 'Quizzes');
const route = useRoute();
const router = useRouter();
const showFriend = ref(true);
const haveAnswered = ref(false);
const quizId = route.params.id;
onMounted(async () => {
    if (quizId === localStorage.getItem(("myQuizId"))) {
        router.push({ name: 'home' })
    }
    else if (localStorage.getItem(quizId)) {
        haveAnswered.value = true;
        showFriend.value = false;
    }
    else {
        const docRef = doc(quizzesCollection, quizId);
        onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                showFriend.value = true;
                haveAnswered.value = false;
            } else {
                router.push({ name: 'notFound' })
            }
        });
    }
});
</script>
