<template>
    <div
        class="w-full mx-auto relative flex h-screen overflow-auto flex-col items-stretch  max-w-2xl  mt-8  text-gray-100 px-5 text-lg font-semibold space-y-12 space-y-reverse">

        <div class="bg-bgray rounded-2xl text-center space-y-7 py-6 text-gray-300 mb-12">
            <Icons />
            <h1 class="text-yellow-400  text-2xl "> ژمارەی وەڵامە ڕاستەکانت بریتیە لە</h1>
            <h1 class=" text-yellow-400 text-2xl md:text-3xl">
                {{ totalCorrectAnswers }} <span class="text-gray-400">لە</span> 10
            </h1>
            <p class="text-2xl md:text-3xl text-indigo-600">بە جدیتە ؟</p>
        </div>
        <div class="space-y-5">
            <h1 class="text-gray-300 text-2xl md:text-3xl">پرسیارەکانت دروست بکە</h1>
            <p class="text-gray-400 text-xl md:text-2xl">ئێستا نۆرەی تۆیە.. &nbsp;&nbsp; پرسیارەکانت دروست بکەو بینێرە بۆ
                هاوڕێکانت</p>
            <button @click.prevent="saveChanges"
                class="py-3 mb-2 bg-indigo-700 rounded-full text-gray-300 font-bold w-3/5 ">با دەست پێبکەین {{ name }}
                گیان</button>
        </div>
        <Guide />
        <Icons />
        <Results :friends="friends" :title="`باشترین هاوڕێکانی ${creatorName}`" />
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Icons from "@/components/Icons.vue"
import Results from "@/components/Results.vue"
import Guide from "@/components/Guide.vue"
import db from '@/firebase';
import { collection, doc, onSnapshot } from 'firebase/firestore';
const friends = ref([]);
const route = useRoute();
const router = useRouter();
const totalCorrectAnswers = ref(0);
const quizId = route.params.id;
const name = ref(localStorage.getItem("name"));
const creatorName = ref("")
const quizzesCollection = collection(db, "Quizzes");
onMounted(() => {
    const storedAnswers = localStorage.getItem(quizId);
    if (storedAnswers !== null) {
        totalCorrectAnswers.value = parseInt(storedAnswers, 10);
        const docRef = doc(quizzesCollection, quizId);
        onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                creatorName.value = doc.data().creatorName;
                friends.value = doc.data().results;
            } else {
                router.push({ name: 'notFound' })
            }
        });
    } else {
        router.push({ name:'notFound' })
    }
});

</script>
  