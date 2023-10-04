<template>
   <div class="text-center  flex justify-center items-center min-h-screen overflow-auto"
      :style="{ backgroundColor: currentQuestionColor.rgba }">
      <div
         class="w-full mx-auto max-w-2xl space-y-5 bg-transparent border -mt-36 md:-mt-7 border-transparent text-gray-100 rounded-3xl px-4 md:px-8 text-lg font-semibold">
         <div>
            <div class="rounded-t-3xl p-6 text-xl" :style="{ backgroundColor: currentQuestionColor.rgb }">
               پرسیارەکانی {{ Quizzes.creatorName }} گیان
            </div>
            <div class="bg-gray-900 rounded-b-3xl p-6">
               <div v-if="currentQuestionIndex < (Quizzes.questions ? Quizzes.questions.length : 0)"
                  class="flex justify-center items-center space-x-4 space-x-reverse">
                  <span class="text-gray-300">{{ currentQuestionIndex + 1 }}/{{ Quizzes.questions.length }}</span>
                  <div class="w-full bg-gray-200 rounded-full dark:bg-gray-700" dir="ltr">
                     <div class="h-4 bg-emerald-500 rounded-full  "
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
                  'px-8 border-[3.5px] border-gray-500 text-gray-200 sm:hover:border-blue-400 rounded-3xl py-2': !showAnswerFeedback,
                  'px-3 border-[3.5px] rounded-3xl py-2 border-green-500': showAnswerFeedback && isCorrectAnswer(ansIndex),
                  'px-3 border-[3.5px] rounded-3xl py-2 border-red-500': showAnswerFeedback && isIncorrectAnswer(ansIndex),
                  'px-8 border-[3.5px] rounded-3xl py-2 border-gray-500': !showAnswerFeedback || (showAnswerFeedback && selectedAnswerIndex !== ansIndex),
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
const selectedAnswerIndex = ref(null);
const name = localStorage.getItem('name')
const userAnswers = ref([]);
const showAnswerFeedback = ref(false);
const totalCorrectAnswers = ref(0);
const emits = defineEmits();
onMounted(async () => {
   const docRef = doc(quizzesCollection, quizId);
   onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
         Quizzes.value = doc.data();
         userAnswers.value = new Array(Quizzes.value.questions.length).fill(null);
      } else {
         router.push({ name: 'notFound' })
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
      selectedAnswerIndex.value = ansIndex;
      showAnswerFeedback.value = true;
      if (ansIndex === Quizzes.value.questions[currentQuestionIndex.value].correctAnswer) {
         totalCorrectAnswers.value += 1;
      }
      setTimeout(() => {
         if (currentQuestionIndex.value < (Quizzes.value.questions ? Quizzes.value.questions.length : 0) - 1) {
            currentQuestionIndex.value += 1;
            showAnswerFeedback.value = false;
            selectedAnswerIndex.value = null;
         } else {
            showResults();
         }
      }, 2000);
   }
};
const showResults = async () => {
   localStorage.setItem(quizId, totalCorrectAnswers.value);
   try {

      emits('showResult')
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
      location.reload();
   } catch (error) {
      router.push({ name: 'notFound' })
   }
};
</script>
