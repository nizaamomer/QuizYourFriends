<template>
   <div class="text-center bg-zinc-900">
      <div class="text-center font-ckb">
         <div
            class="w-full mx-auto max-w-xl  rtl:space-y-reverse space-y-10  bg-transparent border border-transparent text-gray-100 rounded-3xl pt-12 px-4 md:px-8 text-lg font-semibold "
            dir="rtl">
            <div v-for="(question, questionIndex) in quizzes.questions" :key="questionIndex"
               :class="`border-${question.color}-600`" class="border-[2.5px]  rounded-2xl bg-bgray relative ">
               <div class="absolute right-5 text-sm p-1 px-2 -top-7 bg-rose-600 rounded-t-xl">پرسیاری {{ questionIndex + 1
               }}
               </div>

               <div class="rounded-t-3xl p-6 text-xl bg-bgray relative">
                  <textarea v-model.trim="question.text" maxlength="150"
                     class="bg-transparent text-base pt-3 border-[2.5px] text-right resize-none outline-none focus:outline-none focus:border-blue-800 whitespace-pre-wrap border-zinc-700 rounded-2xl w-full px-4 h-20"></textarea>
                  <span class="text-gray-400 text-xs absolute left-8 bottom-10">{{ question.text.length + "/150" }}</span>
               </div>

               <div v-for="(answer, answerIndex) in question.answers" :key="answerIndex"
                  class="bg-bgray rounded-b-3xl p-3 space-y-2 rtl:space-y-reverse text-right">
                  <div class="flex justify-center rtl:space-x-reverse items-center space-x-3">
                     <label :for="questionIndex + '_' + answerIndex">
                        <i v-if="question.correctAnswer === answerIndex"
                           class="text-green-500 bg-gray-200 rounded-full  font-bold text-2xl fa-solid fa-circle-check"></i>
                        <i v-else class="text-zinc-700 font-bold text-2xl fa-regular fa-circle"></i>
                     </label>
                     <input type="radio" :value="answerIndex" v-model.trim="question.correctAnswer"
                        :id="questionIndex + '_' + answerIndex" class="hidden" />
                     <textarea v-model="answer.text"
                        :class="question.correctAnswer === answerIndex ? 'bg-green-600' : 'bg-transparent'" maxlength="100"
                        class=" pt-1 items-start border-[2.5px] border-zinc-700 rounded-2xl w-full px-4 h-16 text-right resize-none outline-none focus:outline-none focus:border-blue-800 whitespace-pre-wrap focus:bg-black"></textarea>

                     <button class="" @click="deleteAnswer(questionIndex, answerIndex)"
                        :disabled="question.answers.length <= 2">
                        <i class="fa-solid fa-circle-xmark text-xl bg-gray-100 rounded-full text-rose-600"></i>
                     </button>
                  </div>
               </div>
               <button @click="addAnswer(questionIndex)"
                  class="bg-zinc-700 rounded-3xl px-2 py-1.5 font-bold text-sm mb-3">بژاردەیەک زیاد بکە</button>
               <div class="flex justify-center items-center space-x-1 rtl:space-x-reverse mb-2">
                  <button v-for="color in colorOptions" :key="color" @click="setQuestionColor(questionIndex, color)">
                     <i v-if="question.color === color"
                        :class="`text-${color}-500 border-none bg-white rounded-full font-bold text-2xl fas fa-circle-check`"></i>
                     <i v-else
                        :class="`text-${color}-500 bg-${color}-500 rounded-full border-none font-bold text-2xl far fa-circle`"></i>
                  </button>
               </div>
            </div>

            <router-link @click.prevent="saveChanges" :to="{ name: 'quizes.copy' }">Save Changes</router-link>
         </div>
      </div>
   </div>
</template>
 
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router"
import db from "@/firebase"
import { collection, addDoc, setDoc, doc } from "firebase/firestore";

const router = useRouter()
onMounted(() => {
   if (!localStorage.getItem("name")) {
      router.push({ name: 'welcome' })
   }
   if (localStorage.getItem("yourQuizId") && localStorage.getItem("name")) {
      router.push({ name: 'quizes.copy' })
   }
})
const quizzes = ref({
   creatorName: localStorage.getItem('name'),
   date: Date.now(),
   questions: [
      {
         text: "🍿 سیریزی پەسندیدەوەی بچیچیکی نتفلیکس؟",
         answers: [
            { text: 'Stranger Things' },
            { text: 'Friends' },
            { text: '13 Reasons Why' },
            { text: 'Narcos' },
         ],
         correctAnswer: null,
         color: 'rose'
      },
      {
         text: "کەسێکی بەشیری، مام یان باو؟",
         answers: [
            { text: '👩 مام' },
            { text: '👨 باو' },
         ],
         correctAnswer: null,
         color: 'indigo'
      },
      {
         text: "🎬 فیلمی پەسندیدەوەی بچیچیک؟",
         answers: [
            { text: 'Avengers: Endgame' },
            { text: 'It: Chapter Two' },
            { text: 'Toy Story 4' },
            { text: 'Spider-Man: Far From Home' },
         ],
         correctAnswer: null,
         color: 'orange'
      },
      {
         text: "👪 چند زمان بچی بەیە؟",
         answers: [
            { text: '10' },
            { text: '3' },
            { text: '2' },
            { text: '1' },
         ],
         correctAnswer: null,
         color: 'yellow'
      },
      {
         text: "ئەگەر بەرەوپێشتر هەموو رووکاری ڕاتیش بڕۆ بخرێت، چی دەخواتەوە؟",
         answers: [
            { text: '🍔 برگر' },
            { text: '🍣 سووشی' },
            { text: '🍕 پیتزا' },
            { text: '🌯 بوریتۆ' },
         ],
         correctAnswer: null,
         color: 'green'
      },
      {
         text: "ئەگەر بە یەک رووبارێک داچەیەت بەرز دەیت، کیشە دیاری دەکەی؟",
         answers: [
            { text: '🐬 دۆلفین' },
            { text: '🐇 خرگوش' },
            { text: '🦈 شارک' },
            { text: '🐼 پاندای خۆشکراو' },
         ],
         correctAnswer: null,
         color: 'pink'
      },
      {
         text: "🌈 چی رەنگی بچی پەسندیدەوە؟",
         answers: [
            { text: 'پینک' },
            { text: 'نیشتر' },
            { text: 'پهڕپهڕه' },
            { text: 'سور' },
            { text: 'سەوز' },
         ],
         correctAnswer: null,
         color: 'teal'
      },
      {
         text: "📺 سیریزی پەسندیدەوەی بچی؟",
         answers: [
            { text: 'The Office' },
            { text: 'Lost' },
            { text: 'Breaking Bad' },
            { text: 'Friends' },
            { text: 'Game of Thrones' },
         ],
         correctAnswer: 4,
         color: 'purple',
      },
      {
         text: "✈️ ئەگەر بچی دەتوانێ بڕۆ بڕی ئەو شوێنە، ئەوا بووەت؟",
         answers: [
            { text: 'هاوایی' },
            { text: 'نیویۆرک' },
            { text: 'Breaking Bad' },
            { text: 'تۆکیۆ' },
            { text: 'لەندەن' },
         ],
         correctAnswer: null,
         color: 'violet'
      },
      {
         text: "بچی هەرگز...",
         answers: [
            { text: '😷 هیچ پێشانگیەکی خۆیە شکستنی هیچ استخوانێک' },
            { text: '🚽 فۆنی مۆبایلی خۆی لە تویلەت دانەوە' },
            { text: '😴 زۆرتر لە ٢٤ کاتژمێر بەیدوە بیدۆزێتەوە' },
            { text: '🍕 یەک کژەی پیتزای خۆیە خواردووە' },
         ],
         correctAnswer: null,
         color: 'zinc'
      },
   ],
});

// const quizzes = ref({
//    creatorName: localStorage.getItem('name'),
//    date: Date.now(),
//    questions: [
//       {
//          text: "🍿 What is s's favorite series on Netflix?",
//          answers: [
//             { text: 'Stranger Things' },
//             { text: 'Friends' },
//             { text: '13 Reasons Why' },
//             { text: 'Narcos' },
//          ],
//          correctAnswer: null,
//          color: 'rose'
//       },
//       {
//          text: "Who is s's favorite, Mom or Dad?",
//          answers: [
//             { text: '👩 Mom' },
//             { text: '👨 Dad' },
//          ],
//          correctAnswer: null,
//          color: 'indigo'
//       },
//       {
//          text: "🎬 What is s's favorite movie?",
//          answers: [
//             { text: 'Avengers: Endgame' },
//             { text: 'It: Chapter Two' },
//             { text: 'Toy Story 4' },
//             { text: 'Spider-Man: Far From Home' },
//          ],
//          correctAnswer: null,
//          color: 'orange'
//       },
//       {
//          text: "👪 How many kids will s have?",
//          answers: [
//             { text: '10' },
//             { text: '3' },
//             { text: '2' },
//             { text: '1' },
//          ],
//          correctAnswer: null,
//          color: 'yellow'
//       },
//       {
//          text: "If s had to eat the same food for dinner every day, what would he pick?",
//          answers: [
//             { text: '🍔 Burger' },
//             { text: '🍣 Sushi' },
//             { text: '🍕 Pizza' },
//             { text: '🌯 Burrito' },
//          ],
//          correctAnswer: null,
//          color: 'green'
//       },
//       {
//          text: "If s could be any animal for a day, which one would it be?",
//          answers: [
//             { text: '🐬 Dolphin' },
//             { text: '🐇 Rabbit' },
//             { text: '🦈 Shark' },
//             { text: '🐼 Panda bear' },
//          ],
//          correctAnswer: null,
//          color: 'pink'
//       },
//       {
//          text: "🌈 What is s's favorite color?",
//          answers: [
//             { text: 'Pink' },
//             { text: 'Blue' },
//             { text: 'Purple' },
//             { text: 'Red' },
//             { text: 'Green' },
//          ],
//          correctAnswer: null,
//          color: 'teal'
//       },
//       {
//          text: "📺 What is s's favorite TV show?",
//          answers: [
//             { text: 'The Office' },
//             { text: 'Lost' },
//             { text: 'Breaking Bad' },
//             { text: 'Friends' },
//             { text: 'Game of Thrones' },
//          ],
//          correctAnswer: 4,
//          color: 'purple',
//       },
//       {
//          text: "✈️ If s could go anywhere, it would be...",
//          answers: [
//             { text: 'Hawaii' },
//             { text: 'New York' },
//             { text: 'Breaking Bad' },
//             { text: 'Tokio' },
//             { text: 'London' },
//          ],
//          correctAnswer: null,
//          color: 'violet'
//       },
//       {
//          text: "s has never ever...",
//          answers: [
//             { text: '😷 Broken a bone' },
//             { text: '🚽 Dropped his/her cellphone in the toilet' },
//             { text: '😴 Stayed up for more than 24 hours' },
//             { text: '🍕 Ate a whole pizza by himself/herself' },
//          ],
//          correctAnswer: null,
//          color: 'zinc'
//       },
//    ],
// });

// Assuming you have initialized your Firebase Firestore instance as 'db'

const quizzesCollection = collection(db, "Quizzes");
const quizzesResultCollection = collection(db, "QuizzesResult");

const saveChanges = async () => {
   try {
      const quizData = JSON.parse(JSON.stringify(quizzes.value));

      // Add the quiz document to quizzesCollection
      const docRef = await addDoc(quizzesCollection, quizData);

      // Store the document ID in a variable
      const quizId = docRef.id;

      // Use the same quizId as a custom ID when adding a document to quizzesResultCollection
      const quizResultRef = doc(quizzesResultCollection, quizId);
      await setDoc(quizResultRef);

      localStorage.setItem("yourQuizId", quizId);
   } catch (error) {
      console.error("Error adding document: ", error);
   }
};



const addAnswer = (questionIndex) => {
   quizzes.value.questions[questionIndex].answers.push({ text: '' });
};
const deleteAnswer = (questionIndex, answerIndex) => {
   const question = quizzes.value.questions[questionIndex];
   if (question.answers.length > 1) {
      question.answers.splice(answerIndex, 1);
   }
};
const colorOptions = [
   'rose',
   'yellow',
   'green',
   'purple',
   'violet',
   'indigo',
   'pink',
   'zinc'
];

const setQuestionColor = (questionIndex, color) => {
   quizzes.value.questions[questionIndex].color = color;
};

const addQuestion = () => {
   quizzes.value.questions.push({
      text: '',
      answers: [{ text: '' }],
      correctAnswer: null,
      color: '', // Add a default color
   });
};
const deleteQuestion = (questionIndex) => {
   quizzes.value.questions.splice(questionIndex, 1);
};
</script>
 
