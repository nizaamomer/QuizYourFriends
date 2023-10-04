<template >
   <div v-if="error" id="toast-danger" dir="ltr"
      class="sticky top-0 text-gray-400 right-0 left-0 sm:left-20 sm:right-10 sm:top-14  flex z-50 items-center w-full sm:max-w-xs p-6 mb-4  sm:rounded-lg shadow  bg-indigo-800"
      role="alert">
      <div class="ml-3 text-sm font-normal text-right">{{ error }}</div>
      <button type="button" @click="error = ''"
         class="ml-auto -mx-1.5 -my-1.5  rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5  inline-flex items-center justify-center h-8 w-8 text-gray-500 hover:text-white bg-gray-800 hover:bg-gray-700"
         data-dismiss-target="#toast-danger" aria-label="Close">
         <span class="sr-only">Close</span>
         <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
               d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
         </svg>
      </button>
   </div>
   <div id="home"
      class="w-full mx-auto relative flex flex-col justify-center items-stretch max-w-2xl my-8 text-gray-100 px-3 md:px-8 text-lg font-semibold space-y-12 space-y-reverse"
      :class="startAnimation">
      <div class="bg-bgray rounded-2xl text-center space-y-10 py-6 text-gray-300 mb-12">
         <h1 class="text-indigo-400 text-2xl mb-5"> پرسیارەکانت دروست بکە </h1>
         <h1 class="text-gray-400 text-lg md:text-xl">
            ✍
            دەستکاری پرسیارو وەڵامەکان بکە و <br> وەڵامی دروست بۆ هەریەک لە پرسیارەکانت هەڵبژێرە
         </h1>
         <Icons />
      </div>
      <div v-for="(question, questionIndex) in quizzes.questions" :key="questionIndex"
         :style="{ borderColor: question.color }" class="border-[3px]  rounded-3xl bg-bgray relative">
         <div class="absolute right-5 text-sm p-1 px-2 -top-7  rounded-t-xl " :style="{ backgroundColor: question.color }">
            پرسیاری {{ questionIndex + 1
            }}
         </div>
         <div class="rounded-t-3xl p-4 text-xl bg-bgray relative">
            <textarea v-model.trim="question.text" maxlength="100"
               class="bg-transparent text2xl pt-3 border-[2.8px] text-right resize-none outline-none focus:outline-none focus:border-blue-800 hover:border-blue-800 focus:bg-black whitespace-pre-wrap border-zinc-700 rounded-2xl w-full px-4 h-[100px]"></textarea>
            <span v-if="question.text" class="text-gray-400 text-xs absolute left-7 bottom-8">{{ question.text.length +
               "/100" }}</span>
         </div>
         <div v-for="(answer, answerIndex) in question.answers" :key="answerIndex" class="bg-bgray px-4 py-1 text-right">

            <div class="flex justify-center rtl:space-x-reverse items-center space-x-2">

               <label :for="questionIndex + '_' + answerIndex">
                  <div class="rounded-full inline-block w-7 h-7">
                     <i v-if="question.correctAnswer === answerIndex"
                        class="text-green-500 font-bold text-2xl fa-solid fa-circle-check  rounded-full "></i>
                     <i v-else class="text-zinc-700 font-bold text-2xl fa-regular fa-circle"></i>
                  </div>
               </label>
               <input type="radio" :value="answerIndex" v-model.trim="question.correctAnswer"
                  :id="questionIndex + '_' + answerIndex" class="hidden" />
               <textarea v-model="answer.text"
                  :class="question.correctAnswer === answerIndex ? 'bg-green-600' : 'bg-transparent'" maxlength="70"
                  class="pt-0.5 text-lg items-start border-[2.8px] border-zinc-700 rounded-2xl w-full px-4 h-[70px] text-right resize-none outline-none focus:outline-none focus:border-blue-800 hover:border-blue-800 whitespace-pre-wrap focus:bg-black"></textarea>
               <button class="inline-block relative p-0 border-0 bg-transparent"
                  @click="deleteAnswer(questionIndex, answerIndex)" :disabled="question.answers.length <= 2">
                  <i class="fa-solid fa-circle-xmark w-6 h-6 text-2xl leading-5 text-rose-700 bg-white rounded-full"></i>
               </button>
            </div>
         </div>
         <button @click="addAnswer(questionIndex)"
            class="bg-zinc-700 rounded-2xl px-4 py-1.5 font-bold text-base my-5">بژاردەیەک زیاد بکە</button>
         <div class="flex justify-center items-center space-x-1 rtl:space-x-reverse mb-2">
            <button v-for="color in colorOptions" :key="color" @click="setQuestionColor(questionIndex, color)">
               <i v-if="question.color === color" :style="{ color: question.color }"
                  class="border-none  bg-white rounded-full  outline-none text-2xl fas fa-circle-check "
                  style="border-radius: 50%;"></i>
               <i v-else :style="{ backgroundColor: color }"
                  class=" rounded-full border-none outline-none text-transparent  text-2xl far fa-circle "></i>
            </button>
         </div>

      </div>
      <button @click.prevent="saveChanges"
         class="py-3 mb-2 bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 rounded-full font-bold w-full ">سەیڤیکە
         {{
            name }} گیان</button>

   </div>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from "vue-router"
import db from "@/firebase"
import { collection, addDoc } from "firebase/firestore";
import Icons from "@/components/Icons.vue";
const router = useRouter()
const name = localStorage.getItem("name")
const colorOptions = [
   'rgb(244, 63, 94)',
   'rgb(99, 102, 241)',
   'rgb(249, 115, 22)',
   'rgb(236, 72, 153)',
   'rgb(34, 197, 94)',
   'rgb(234, 179, 8)',
   'rgb(37, 99, 235)',
   'rgb(168, 85, 247)',
   'rgb(31, 41, 55)',
   'rgb(239, 68, 68)',
];

const quizzes = ref({
   creatorName: localStorage.getItem('name'),
   date: Date.now(),
   questions: [
      {
         text: `ئەگەر ${name} ناچار بێت هەموو ڕۆژێک هەمان خواردن بۆ ژەمی ئێوارە بخوات، چی هەڵدەبژێرن؟`,
         answers: [
            { text: '🍔 بەرگر' },
            { text: '🍗 برنج و مریشک' },
            { text: '🍕 پیتزا' },
            { text: '🌯 فەلافل ڕەزیل' },
         ],
         correctAnswer: null,
         color: colorOptions[0],
      },

      {
         text: `${name} کێی زۆر خۆش ئەوێ لە ناو بێستەکانی💞`,
         answers: [
            { text: 'نازە' },
            { text: 'کارە' },
            { text: 'محمد' },
            { text: 'سۆزەی کرەشی' },
         ],
         correctAnswer: null,
         color: colorOptions[1],
      },
      {
         text: `🎬 خۆشەویستترین فیلمی ${name} چییە؟`,
         answers: [
            { text: 'Interstellar 🚀' },
            { text: 'Toy Story 4' },
            { text: 'Spider-Man: Far From Home' },
            { text: '' },
         ],
         correctAnswer: null,
         color: colorOptions[2],
      },
      {
         text: `👪 چەند منداڵی دەبێت ${name} لە داهاتوو ؟`,
         answers: [
            { text: '3' },
            { text: '2' },
            { text: '1' },
            { text: '10' },
         ],
         correctAnswer: null,
         color: colorOptions[3],
      },
      {
         text: `🍿 دڵخوازترین زنجیرەی ${name} چییە؟`,
         answers: [
            { text: 'Stranger Things' },
            { text: 'Friends' },
            { text: 'Game of thrones' },
            { text: 'سەمای تەرزە 🦦' },
         ],
         correctAnswer: null,
         color: colorOptions[4],
      },
      {
         text: `ئەگەر ${name} بتوانێت بۆ ماوەی ڕۆژێک هەر ئاژەڵێک بێت، کامیان دەبێت؟ 😂`,
         answers: [
            { text: '🐬 دۆلفین' },
            { text: '🐇 کەوێشک' },
            { text: '😸 پشیلە' },
            { text: '🐼 پاندا' },
         ],
         correctAnswer: null,
         color: colorOptions[5],
      },
      {
         text: ` ڕەنگی دڵخوازی ${name} چییە؟`,
         answers: [
            { text: 'پینکی پینکی' },
            { text: 'شین' },
            { text: 'سور' },
            { text: 'زەرد' },
            { text: 'سەوز' },
         ],
         correctAnswer: null,
         color: colorOptions[6],
      },
      {
         text: `📺 What is ${name}'s favorite TV show?`,
         answers: [
            { text: 'The Office' },
            { text: 'Lost' },
            { text: 'Breaking Bad' },
            { text: 'Friends' },
            { text: 'Game of Thrones' },
         ],
         correctAnswer: null,
         color: colorOptions[7],
      },
      {
         text: `ئەگەر ${name} بچێت بۆ گەشت یەکەم شوێن کە بڕوات... ✈️`,
         answers: [
            { text: 'نیویۆرک' },
            { text: 'هاوایی' },
            { text: 'کەنەدا' },
            { text: 'پاریس' },
            { text: 'شارەزوور' },
         ],
         correctAnswer: null,
         color: colorOptions[8],
      },
      {
         text: `${name} هەرگیز هەرگیز...`,
         answers: [
            { text: '😷 دڵی کەس ناشکێنێت' },
            { text: '🚽 Dropped their cellphone in the toilet' },
            { text: '😴 Stayed up for more than 24 hours' },
            { text: '🍕 Ate a whole pizza by themselves' },
         ],
         correctAnswer: null,
         color: colorOptions[9],
      },
   ],
});

const startAnimation = ref("")
const emits = defineEmits();

// Assuming you have initialized your Firebase Firestore instance as 'db'
const quizzesCollection = collection(db, "Quizzes");
const error = ref("");
const saveChanges = async () => {
   let hasErrors = false; // Track if there are any errors

   for (const [questionIndex, question] of quizzes.value.questions.entries()) {
      if (question.text.trim().length === 0) {
         // error.value = `Question ${questionIndex + 1} text is empty.`;
         error.value = "...ڕەحمەتت لێبێت خانەی پرسیارەکان بە بەتاڵی جێمەهێڵە";
         hasErrors = true; // Set the flag to true if there is an error
      }
      let hasCorrectAnswer = false;
      for (const [answerIndex, answer] of question.answers.entries()) {
         if (answer.text.trim().length === 0) {
            error.value = "...ڕەحمەتت لێبێت خانەی وەڵامەکان بە بەتاڵی جێمەهێڵە"
            // error.value = `Answer ${answerIndex + 1} in question ${questionIndex + 1} is empty.`;
            hasErrors = true; // Set the flag to true if there is an error
         }
         if (question.correctAnswer === answerIndex) {
            hasCorrectAnswer = true;
         }
      }
      if (!hasCorrectAnswer) {
         error.value = `(: ${name} گیان وەڵامە دروستەکان بە تەواوی هەڵبژێرە دڵە `
         // error.value = `Question ${questionIndex + 1} does not have a correct answer selected.`;
         hasErrors = true; // Set the flag to true if there is an error
      }
   }

   if (!hasErrors) {
      try {
         const quizData = JSON.parse(JSON.stringify(quizzes.value));
         setTimeout(async () => {
            startAnimation.value = 'transition-all duration-700  scale-0';
            const docRef = await addDoc(quizzesCollection, quizData);
            const quizId = docRef.id;
            localStorage.setItem("myQuizId", quizId);
            scrollToTop()
            emits('haveQuistion');
         }, 350);
      } catch (error) {
         router.push({ name: 'notFound' });
      }
   }
};
const scrollToTop = () => {
   const scrollContainer = document.getElementById('home');
   if (scrollContainer) {
      scrollContainer.scrollTop = 0;
   }
}

const addAnswer = (questionIndex) => {
   quizzes.value.questions[questionIndex].answers.push({ text: `شتێک بنووسە ${name} گیان` });
};
const deleteAnswer = (questionIndex, answerIndex) => {
   const question = quizzes.value.questions[questionIndex];
   if (question.answers.length > 1) {
      question.answers.splice(answerIndex, 1);
   }
};
watch(error, (newValue) => {
   if (newValue) {
      setTimeout(() => {
         error.value = '';
      }, 3000);
   }
});
const setQuestionColor = (questionIndex, color) => {
   quizzes.value.questions[questionIndex].color = color;
};
</script>
 
