<template>
   <div class="text-center  h-screen" :style="{ backgroundColor: currentQuestionColor.rgba }">
      <div
         class="w-full mx-auto max-w-2xl space-y-5 bg-transparent border border-transparent text-gray-100 rounded-3xl pt-12 px-4 md:px-8 text-lg font-semibold">
         <div>
            <div class="rounded-t-3xl p-6 text-xl" :style="{ backgroundColor: currentQuestionColor.rgb }">
               {{ Quizzes.creatorName }}'s Quiz
            </div>
            <div class="bg-gray-900 rounded-b-3xl p-6">
               <div v-if="currentQuestionIndex < (Quizzes.questions ? Quizzes.questions.length : 0)"
                  class="flex justify-center items-center space-x-2">
                  <span class="text-gray-300"> {{ currentQuestionIndex + 1 }}/{{ Quizzes.questions.length }}</span>
                  <div class="w-full  bg-gray-200 rounded-full dark:bg-gray-700">
                     <div class="h-4 bg-emerald-500 rounded-full "
                        :style="{ width: ((currentQuestionIndex + 1) / (Quizzes.questions.length)) * 100 + '%' }"></div>
                  </div>
               </div>
            </div>
         </div>
         <div v-if="currentQuestionIndex < (Quizzes.questions ? Quizzes.questions.length : 0)">
            <div class=" rounded-t-3xl p-6 text-xl" :style="{ backgroundColor: currentQuestionColor.rgb }">
               {{ Quizzes.questions[currentQuestionIndex].text }}
            </div>
            <div class="bg-gray-900 rounded-b-3xl p-6 space-y-2 text-right">
               <div v-for="(answer, ansIndex) in Quizzes.questions[currentQuestionIndex].answers" :key="ansIndex" :class="{
                  'pr-6 border-2 border-gray-500 hover:border-blue-400 rounded-3xl py-1.5':
                     !showAnswerFeedback, // Only apply the style if not showing answer feedback
                  'pr-6 border-2 rounded-3xl py-1.5': showAnswerFeedback, // Apply this style when showing answer feedback
                  'bg-green-500 text-white':
                     showAnswerFeedback && ansIndex === Quizzes.questions[currentQuestionIndex].correctAnswer,
                  'bg-red-500 text-white':
                     showAnswerFeedback &&
                     userAnswers[currentQuestionIndex] === ansIndex &&
                     ansIndex !== Quizzes.questions[currentQuestionIndex].correctAnswer,
                  'bg-gray-900 text-gray-100': showAnswerFeedback,
               }" @click="selectAnswer(ansIndex)">
                  {{ answer.text }}
               </div>
            </div>
         </div>
      </div>
   </div>
</template>
 
<script setup>
import { ref, onMounted, watch, onBeforeMount, computed } from 'vue';
import db from "@/firebase"
import { useRouter, useRoute } from "vue-router"
const router = useRouter()
const route = useRoute()

import { collection, doc, addDoc, onSnapshot, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
const quizzesCollection = collection(db, "Quizzes");
const Quizzes = ref([]);
const currentQuestionIndex = ref(0);
const userAnswers = ref([]);
const showAnswerFeedback = ref(false);
const totalCorrectAnswers = ref(0);
const quizId = route.params.id
onBeforeMount(() => {
   if (localStorage.getItem(quizId)) {
      router.push({ name: 'answer.result' })
   }
   Quizzes.value.questions = [];
})
onMounted(async () => {
   const docRef = doc(quizzesCollection, quizId);
   onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
         Quizzes.value = doc.data();
         userAnswers.value = new Array(Quizzes.value.questions.length).fill(null);
      } else {
         console.log("Document does not exist.");
      }
   });
});



const currentQuestionColor = computed(() => {
   if (
      Quizzes.value.questions &&
      Quizzes.value.questions.length > 0 &&
      currentQuestionIndex.value < Quizzes.value.questions.length
   ) {
      const rgbColor = `rgb${Quizzes.value.questions[currentQuestionIndex.value].color.slice(3, -1)}`;
      const rgbaColor = `rgba${Quizzes.value.questions[currentQuestionIndex.value].color.slice(3, -1)}, 0.7)`;

      return { rgb: rgbColor, rgba: rgbaColor };
   } else {
      return { rgb: '', rgba: '' };
   }
});

// You can now use 'currentQuestionColor' in your component's template or elsewhere in your code.




// watch([currentQuestionIndex, () => Quizzes.value.questions], () => {

//    console.log('Computed Class:', currentQuestionColor.value);
// });


const selectAnswer = (ansIndex) => {
   if (!showAnswerFeedback.value) {
      userAnswers.value[currentQuestionIndex.value] = ansIndex;
      showAnswerFeedback.value = true;
      if (ansIndex === Quizzes.value.questions[currentQuestionIndex.value].correctAnswer) {
         totalCorrectAnswers.value += 1;
      }

      setTimeout(() => {
         if (currentQuestionIndex.value < (Quizzes.value.questions ? Quizzes.value.questions.length : 0) - 1) {
            currentQuestionIndex.value += 1;
            showAnswerFeedback.value = false;
         } else {
            showResults();
         }
      }, 2000);
   }
};


const name = localStorage.getItem("name");
const quizzesResultCollection = collection(db, "Quizzes");

const showResults = async () => {
   console.log("Quiz completed! Total Correct Answers: ", totalCorrectAnswers.value);
   localStorage.setItem(quizId, totalCorrectAnswers.value);


   try {
      const docRef = doc(quizzesResultCollection, quizId);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
         const existingData = docSnapshot.data();

         if (existingData.results) {
            existingData.results.push({
               name: name,
               correctResult: totalCorrectAnswers.value
            });
         } else {
            existingData.results = [{
               name: name,
               correctResult: totalCorrectAnswers.value
            }];
         }

         await updateDoc(docRef, {
            results: existingData.results
         });
         router.push({ name: 'answer.result' });
      } else {
         // Create a new document with the results array
         await setDoc(docRef, {
            results: [{
               name: name,
               correctResult: totalCorrectAnswers.value
            }]
         });
      }
   } catch (error) {
      console.error("Error updating/adding document: ", error);
   }
};



</script>
 