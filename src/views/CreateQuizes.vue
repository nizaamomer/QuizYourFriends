<template>
   <div class="text-center">
      <h2>Edit and Add Questions</h2>


      <div v-for="(question, questionIndex) in quizzes.questions" :key="questionIndex"
         class="max-w-sm p-6 mx-auto mb-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

         <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
         <div>
            <label>Q</label>
            <input v-model="question.text" />
         </div>
         </p>
         <div v-for="(answer, answerIndex) in question.answers" :key="answerIndex">
            <div>

               <input v-model="answer.text" />
               <input type="radio" :value="answerIndex" v-model="question.correctAnswer" />
               <button @click="deleteAnswer(questionIndex, answerIndex)" :disabled="question.answers.length <= 1">
                  Delete Answer
               </button>
            </div>
         </div>
         <button @click="addAnswer(questionIndex)">Add Answer</button>
         <button @click="deleteQuestion(questionIndex)">Delete Question</button>
      </div>
      <button @click="addQuestion">Add Question</button>
      <button @click="saveChanges">Save Changes</button>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router"
import db from "@/firebase"
import { collection, addDoc } from "firebase/firestore";
const router = useRouter()
onMounted(() => {
   if (!localStorage.getItem("name")) {
      router.push({ name: 'welcome' })
   }
})
const quizzes = ref({
   creator_name: localStorage.getItem('name'),
   date:Date.now(),
   questions: [
      {
         text: "🍿 What is s's favorite series on Netflix?",
         answers: [
            { text: 'Stranger Things' },
            { text: 'Friends' },
            { text: '13 Reasons Why' },
            { text: 'Narcos' },
         ],
         correctAnswer: 1,
      },
      {
         text: "Who is s's favorite, Mom or Dad?",
         answers: [
            { text: '👩 Mom' },
            { text: '👨 Dad' },
         ],
         correctAnswer: 1,
      },
      {
         text: "🎬 What is s's favorite movie?",
         answers: [
            { text: 'Avengers: Endgame' },
            { text: 'It: Chapter Two' },
            { text: 'Toy Story 4' },
            { text: 'Spider-Man: Far From Home' },
         ],
         correctAnswer: 1,
      },
      {
         text: "👪 How many kids will s have?",
         answers: [
            { text: '10' },
            { text: '3' },
            { text: '2' },
            { text: '1' },
         ],
         correctAnswer: 3,
      },
      {
         text: "If s had to eat the same food for dinner every day, what would he pick?",
         answers: [
            { text: '🍔 Burger' },
            { text: '🍣 Sushi' },
            { text: '🍕 Pizza' },
            { text: '🌯 Burrito' },
         ],
         correctAnswer: 0,
      },
      {
         text: "If s could be any animal for a day, which one would it be?",
         answers: [
            { text: '🐬 Dolphin' },
            { text: '🐇 Rabbit' },
            { text: '🦈 Shark' },
            { text: '🐼 Panda bear' },
         ],
         correctAnswer: 0,
      },
      {
         text: "🌈 What is s's favorite color?",
         answers: [
            { text: 'Pink' },
            { text: 'Blue' },
            { text: 'Purple' },
            { text: 'Red' },
            { text: 'Green' },
         ],
         correctAnswer: 3,
      },
      {
         text: "📺 What is s's favorite TV show?",
         answers: [
            { text: 'The Office' },
            { text: 'Lost' },
            { text: 'Breaking Bad' },
            { text: 'Friends' },
            { text: 'Game of Thrones' },
         ],
         correctAnswer: 4,
      },
      {
         text: "✈️ If s could go anywhere, it would be...",
         answers: [
            { text: 'Hawaii' },
            { text: 'New York' },
            { text: 'Breaking Bad' },
            { text: 'Tokio' },
            { text: 'London' },
         ],
         correctAnswer: 4,
      },
      {
         text: "s has never ever...",
         answers: [
            { text: '😷 Broken a bone' },
            { text: '🚽 Dropped his/her cellphone in the toilet' },
            { text: '😴 Stayed up for more than 24 hours' },
            { text: '🍕 Ate a whole pizza by himself/herself' },
         ],
         correctAnswer: 3,
      },
   ],
});
const todoCollection = collection(db, "Quizzes")
const saveChanges = async () => {
   try {
      const docRef = await addDoc(todoCollection, JSON.parse(JSON.stringify(quizzes.value)));
      localStorage.setItem("yourQuizId", docRef.id);
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
const addQuestion = () => {
   quizzes.value.questions.push({
      text: '',
      answers: [{ text: '' }],
      correctAnswer: null,
   });
};



const deleteQuestion = (questionIndex) => {
   quizzes.value.questions.splice(questionIndex, 1);
};


// Make a deep copy of the quizzes object to quizzes2
// quizzes2.value = JSON.parse(JSON.stringify(quizzes.value));
// console.log(quizzes2.value);
const quizzes2 = ref(null);
</script>
