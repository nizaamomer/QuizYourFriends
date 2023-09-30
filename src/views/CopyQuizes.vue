<template>
   <div class="bg-zinc-950 h-screen">
      <div
         class="w-full mx-auto  max-w-xl font-ckb  rtl:space-y-reverse space-y-12  bg-transparent border border-transparent text-gray-100 rounded-3xl  px-4 md:px-8 text-lg font-semibold "
         dir="rtl">
         <div class="bg-bgray rounded-2xl p-8 text-center space-y-10 py-6 text-gray-300">
            <h1 class="text-indigo-400 text-2xl mb-5">  پیرۆزە پرسیارەکانت ئامادەیە </h1>
            <h1 class="text-2xl leading-loose">
               لینکەکە بنێرە بۆ هاوڕێکانت و تاقیانکەرە تا چەنێ ئەتناسن 👀
            </h1>
            <div class="py-2 mb-2  bg-gray-900 rounded-2xl  font-bold w-4/5 whitespace-break-spaces">
               <span class="text-gray-400 text-base font-normal">https://</span><span class="text-white text-xl">{{
                  myDomain }}/</span><span class="text-yellow-500 text-lg">{{ myQuizId }}</span>
            </div>
            <button @click.prevent="copyLink" class="py-3 mb-2 bg-indigo-700 rounded-full font-bold w-full " v-if="!copyed">کۆپی لینک</button>
            <button class="py-3 mb-2 bg-indigo-700 rounded-full font-bold w-full " v-else>کۆپی کرا</button>
         </div>
      </div>
      <span>{{ url }}</span>


  

   <div v-for="friend in friends">
      {{ friend.name }}
      {{ friend.correctResult }}
   </div>
   <button type="button" @click="deleteQuiz">Delete</button>
   </div>
</template>

 


<script setup>

import { ref, onMounted } from 'vue';
import db from "@/firebase"
import { useRouter, useRoute } from "vue-router"
import { collection, doc, onSnapshot, deleteDoc } from "firebase/firestore";

const router = useRouter()
const route = useRoute()
const quizzesCollection = collection(db, "Quizzes");
const myQuizId = localStorage.getItem("yourQuizId")
const name = localStorage.getItem("name");
const url = new URL(window.location.href);
const myDomain = url.hostname;

const link = ref(myDomain + "/" + myQuizId)

const copyed = ref(false)
function copyLink() {
   copyed.value = true
   navigator.clipboard.writeText(link.value);
}


watch(error, (newValue) => {
   if (newValue) {
      setTimeout(() => {
         error.value = '';
      }, 3000);
   }
});
const friends = ref([]);
const docQuizzes = doc(quizzesCollection, myQuizId);

onMounted(async () => {
   onSnapshot(docQuizzes, (doc) => {
      if (doc.exists()) {
         friends.value = doc.data().results;
      } else {
         console.log("Document does not exist.");
      }
   });
});

const deleteQuiz = async () => {
   try {
      await deleteDoc(docQuizzes);
      localStorage.removeItem('yourQuizId');
      //browa bo sarata
   } catch (error) {
      console.error("Error deleting document: ", error);
   }
}
</script>
 