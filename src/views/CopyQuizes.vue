<template>
   <div>
      <span>{{ url }}</span> <br>
      <button @click="copyLink" class="cursor-copy">Copy link</button>
   </div>

   <div v-for="friend in friends">
      {{ friend.name }}
      {{ friend.correctResult }}
   </div>
   <button type="button" @click="deleteQuiz">Delete</button>
</template>
 
<script setup>
import { ref, onMounted } from 'vue';
import db from "@/firebase"
import { useRouter, useRoute } from "vue-router"
import { collection, doc, onSnapshot, deleteDoc } from "firebase/firestore";

const router = useRouter()
const route = useRoute()
const quizzesCollection = collection(db, "Quizzes"); // Fix the collection reference here
const quizzesResultCollection = collection(db, "QuizzesResult");
const myQuizId = localStorage.getItem("yourQuizId")
const name = localStorage.getItem("name");
const url = ref(window.location.origin + "/" + myQuizId)

function copyLink() {
   navigator.clipboard.writeText(url.value);
}

const friends = ref([]);
const docQuizzes = doc(quizzesCollection, myQuizId);
const docResult = doc(quizzesResultCollection, myQuizId);

onMounted(async () => {
   onSnapshot(docResult, (doc) => {
      if (doc.exists()) {
         friends.value = doc.data().results;
      } else {
         console.log("Document does not exist.");
      }
   });
});

const deleteQuiz = async () => { // Add the async keyword here
   try {
      await deleteDoc(docResult);
      await deleteDoc(docQuizzes);
      console.log("Document deleted successfully.");
   } catch (error) {
      console.error("Error deleting document: ", error);
   }
}
</script>
 