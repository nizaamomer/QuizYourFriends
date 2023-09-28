<!-- QuestionForm.vue -->

<template>
  <h2>Add a Question</h2>
  <!-- <form @submit.prevent="saveQuestion">
      <label for="question">Question:</label>
      <input type="text" id="question" v-model="newQuestion" required>
      <label for="answer">Answer:</label>
      <input type="text" id="answer" v-model="newAnswer" required>
      <div v-for="(option, index) in options" :key="index">
        <label :for="'option-' + index">Option {{ index + 1 }}:</label>
        <input :id="'option-' + index" v-model="options[index]" required>
   
        <button type="button" @click="removeOption(index)">Remove Option</button>
      </div>
      <button type="button" @click="addOption">Add Option</button>
      <button type="submit">Save</button>
    </form>-->


  <form @submit.prevent="add">
    <input type="text" v-model="content">
    <button type="submit" :disabled="!content">Add</button>
  </form>

  <ul class="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
    <li v-for="item in todo" :key="item.id">
      {{ item.content }} <button @click="deleteTodo(item.id)">Delete</button>
    </li>
  </ul>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import db from "@/firebase"
import { collection, where, onSnapshot, getDocs, addDoc, deleteDoc, doc, query, orderBy, limit } from "firebase/firestore";
const todoCollection = collection(db, "todos")
const todoQury = query(todoCollection, orderBy("date", "desc"));
onMounted(async () => {

  // const querySnapshot = await getDocs(todoCollection);
  // let fbTodos = []
  // querySnapshot.forEach((doc) => {
  //   console.log(doc.id, " => ", doc.data());
  //   const todo = {
  //     id: doc.id,
  //     content: doc.data().content
  //   }
  //   fbTodos.push(todo)
  // }); todo.value = fbTodos
  //_____________________

  // const q = query(collection(db, "cities"), where("state", "==", "CA"));


  onSnapshot(todoQury, (querySnapshot) => {
    let fbTodos = []
    querySnapshot.forEach((doc) => {
      const todo = {
        id: doc.id,
        content: doc.data().content,
        date: doc.data().date
      }
      fbTodos.push(todo)
    });
    todo.value = fbTodos
  });
})






const todo = ref([]);

const content = ref('');

const add = async () => {
  // const newTodo = {
  //   id: uuidv4(),
  //   content: content.value,
  // };
  // todo.value.unshift(newTodo);
  const docRef = await addDoc(todoCollection, {
    content: content.value,
    date: Date.now(),
  });

  content.value = '';
};

const deleteTodo = async (id) => {
  await deleteDoc(doc(db, "todos", id));
  // todo.value = todo.value.filter(todo => todo.id !== id)
};








// const newQuestion = ref('');
// const newAnswer = ref('');
// const options = ref(['']);

// const addOption = () => {
//   options.value.push('');
// };

// const removeOption = (index) => {
//   options.value.splice(index, 1);
// };

// const saveQuestion = () => {
//   const questionData = {
//     question: newQuestion.value,
//     answer: newAnswer.value,
//     options: options.value,
//   };

//   // Send the question data to your server to save to a JSON file
//   newQuestion.value = '';
//   newAnswer.value = '';
//   options.value = ['']; // Reset options to one empty option
// };

</script>>
