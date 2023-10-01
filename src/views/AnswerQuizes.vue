<template>
   <div class="text-center font-ckb flex items-center min-h-screen overflow-hidden"
      :style="{ backgroundColor: currentQuestionColor.rgba }">
      
      <div
         class="w-full mx-auto max-w-2xl space-y-5 bg-transparent border -mt-32 border-transparent text-gray-100 rounded-3xl px-4 md:px-8 text-lg font-semibold">
         <div>
            <div class="rounded-t-3xl p-6 text-xl" :style="{ backgroundColor: currentQuestionColor.rgb }">
               پرسیارەکانی {{ Quizzes.creatorName }} گیان
            </div>
            <div class="bg-gray-900 rounded-b-3xl p-6">
               <div v-if="currentQuestionIndex < (Quizzes.questions ? Quizzes.questions.length : 0)"
                  class="flex justify-center items-center space-x-2">
                  <span class="text-gray-300">{{ currentQuestionIndex + 1 }}/{{ Quizzes.questions.length }}</span>
                  <div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                     <div class="h-4 bg-emerald-500 rounded-full "
                        :style="{ width: ((currentQuestionIndex + 1) / (Quizzes.questions.length)) * 100 + '%' }"></div>
                  </div>
               </div>
            </div>
         </div>
         <div v-if="currentQuestionIndex < (Quizzes.questions ? Quizzes.questions.length : 0)">
            <div class="rounded-t-3xl p-6 text-xl" :style="{ backgroundColor: currentQuestionColor.rgb }">
               {{ Quizzes.questions[currentQuestionIndex].text }}
            </div>
            <div class="bg-gray-900 rounded-b-3xl p-6 space-y-2 text-right">
               <div v-for="(answer, ansIndex) in Quizzes.questions[currentQuestionIndex].answers" :key="ansIndex" :class="{
                  'px-5 border-[3.5px] border-gray-500 text-gray-200 sm:hover:border-blue-400 rounded-3xl py-1.5 ': !showAnswerFeedback,
                  'px-5 border-[3.5px] rounded-3xl py-1.5 border-gray-500 flex justify-end items-center text-right': showAnswerFeedback,
                  'border-green-500 ': showAnswerFeedback && isCorrectAnswer(ansIndex),
                  'border-red-500': showAnswerFeedback && isIncorrectAnswer(ansIndex),
               }" @click="selectAnswer(ansIndex)">
                  <i v-if="showAnswerFeedback && isCorrectAnswer(ansIndex)"
                     class="fa-solid fa-circle-check text-green-500"></i>
                  <i v-if="showAnswerFeedback && isIncorrectAnswer(ansIndex)"
                     class="fa-solid fa-circle-xmark text-red-500"></i>
                  {{ answer.text }}
               </div>
            </div>
         </div>
      </div>
   </div>
</template>
 
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import db from '@/firebase';
import { collection, doc, onSnapshot, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const router = useRouter();
const route = useRoute();

const quizzesCollection = collection(db, 'Quizzes');
const quizId = route.params.id;

const Quizzes = ref({});
const currentQuestionIndex = ref(0);
const userAnswers = ref([]);
const showAnswerFeedback = ref(false);
const totalCorrectAnswers = ref(0);

onMounted(async () => {
   if (localStorage.getItem(quizId)) {
      router.push({ name: 'answer.result' });
   }

   const docRef = doc(quizzesCollection, quizId);

   onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
         Quizzes.value = doc.data();
         userAnswers.value = new Array(Quizzes.value.questions.length).fill(null);
      } else {
         console.log('Document does not exist.');
      }
   });
});

const isCorrectAnswer = (ansIndex) => {
   return (
      showAnswerFeedback.value &&
      ansIndex === Quizzes.value.questions[currentQuestionIndex.value].correctAnswer &&
      ansIndex === userAnswers.value[currentQuestionIndex.value]
   );
};

const isIncorrectAnswer = (ansIndex) => {
   return (
      showAnswerFeedback.value &&
      ansIndex === userAnswers.value[currentQuestionIndex.value] &&
      ansIndex !== Quizzes.value.questions[currentQuestionIndex.value].correctAnswer
   );
};

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

const showResults = async () => {
   console.log('Quiz completed! Total Correct Answers: ', totalCorrectAnswers.value);
   localStorage.setItem(quizId, totalCorrectAnswers.value);

   try {
      const docRef = doc(quizzesCollection, quizId);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
         const existingData = docSnapshot.data();

         if (existingData.results) {
            existingData.results.push({
               name: name,
               correctResult: totalCorrectAnswers.value,
            });
         } else {
            existingData.results = [
               {
                  name: name,
                  correctResult: totalCorrectAnswers.value,
               },
            ];
         }

         await updateDoc(docRef, {
            results: existingData.results,
         });
         router.push({ name: 'answer.result' });
      } else {
         await setDoc(docRef, {
            results: [
               {
                  name: name,
                  correctResult: totalCorrectAnswers.value,
               },
            ],
         });
      }
   } catch (error) {
      console.error('Error updating/adding document: ', error);
   }
};
</script>
 