<template>
   <div class="bg-zinc-950  flex flex-col py-10 justify-center items-center  text-white" dir="rtl">
      <div v-if="copyed" id="toast-danger"
         class="absolute top-0 text-center font-ckb text-gray-400  sm:left-20 sm:right-10 sm:top-14  flex z-50 items-center w-full sm:max-w-xs p-6 mb-4  sm:rounded-lg shadow  bg-indigo-800"
         role="alert">
         <div class="ml-3 text-sm font-normal ">بە سەرکەووتووی کۆپی کرا...</div>
      </div>

      <div
         class="w-full mx-auto space-y-20   max-w-xl font-ckb  bg-transparent border border-transparent text-gray-100 rounded-3xl  px-4 md:px-8 text-lg font-semibold ">
         <div class="bg-bgray rounded-2xl p-8 text-center space-y-10 py-6 text-gray-300">
            <h1 class="text-indigo-400 text-2xl mb-5"> پیرۆزە پرسیارەکانت ئامادەیە </h1>
            <h1 class="text-2xl leading-loose text-gray-300">
               لینکەکە بنێرە بۆ هاوڕێکانت و تاقیانکەرە تا چەنێ ئەتناسن 👀
            </h1>
            <div dir="ltr"
               class="py-2 mb-2 bg-gray-950 rounded-2xl font-bold w-full whitespace-break-spaces flex flex-wrap sm:flex-row items-center justify-center">
               <span class="text-gray-400 text-base font-normal sm:mb-0">https://</span>
               <span class="text-white text-xl sm:mb-0">{{ myDomain }}/</span>
               <span class="text-yellow-500 text-lg">{{ myQuizId }}</span>
            </div>

            <button @click.prevent="copyLink"
               class="py-3 mb-2 bg-indigo-700 space-x-2 flex items-center justify-center rtl:space-x-reverse rounded-full font-bold w-full "
               v-if="!copyed"> <span><i class="fa-solid fa-copy text-gray-400"></i> </span> <span>کۆپی لینک
               </span></button>
            <button class="py-3 mb-2 bg-indigo-700 text-green-400 rounded-full font-bold w-full " v-else>کۆپی کرا</button>
         </div>
         <div class="bg-bgray rounded-2xl p-8  text-center space-y-0 py-5 px-8 text-gray-300 " dir="ltr">
            <h1 class="text-center text-indigo-400 text-xl my-2">باشترین هاوڕێکانت</h1>
            <div class="flex justify-between items-center">
               <th scope="col" class="px-6 py-3">
                  وەڵامی ڕاست
               </th>
               <th scope="col" class="px-6 py-3">
                  ناو
               </th>
            </div>
            <div v-for="friend in friends"
               class="flex justify-between items-center border-b border-indigo-800 bg-zinc-800 rounded">
               <th scope="col" class="px-6 py-3">
                  {{ friend.correctResult }}<span class>/10</span>
               </th>
               <th scope="col" class="px-6 py-3">
                  {{ friend.name }}
               </th>
            </div>
         </div>
         <div class="bg-bgray rounded-2xl p-8  text-center space-y-10 py-8 text-gray-300 ">
            <div><i class="fa-solid fa-bell text-yellow-500 text-5xl"></i></div>
            <p class="text-gray-400 sm:text-2xl">بۆ ئەوەی بتوانیت پرسیاری دیکە دروست بکەی دەبێت ئەم پرسیارانە بسڕیەوە ...
            </p>
            <button @click="deleteQuiz" class="py-3 mb-2 bg-red-700 rounded-full font-bold w-full "> سڕینەوە
            </button>
         </div>

      </div>








   </div>
</template>

 


<script setup>

import { ref, onMounted, watch } from 'vue';
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
const  copyLink = () =>{
   copyed.value = true
   navigator.clipboard.writeText(link.value);
}

watch(copyed, (newValue) => {
   if (newValue) {
      setTimeout(() => {
         copyed.value = false;
      }, 1500);
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
 