<template>
    <div class="text-center bg-red-400">
        <div
            class="w-full mx-auto max-w-2xl space-y-5 bg-transparent border border-transparent text-gray-100 rounded-3xl pt-12 px-4 md:px-8 text-lg font-semibold">
            <div>
                <div class="bg-red-500 rounded-t-3xl p-6 text-xl">
                    <!-- {{ Quizzes.creatorName }}'s Quiz -->
                </div>
                <div class="bg-gray-900 rounded-b-3xl p-6">

                   
                        <p class="text-xl">Quiz completed! You've answered all the questions.</p>
                        <p class="text-xl">Total Correct Answers: {{ totalCorrectAnswers }}</p>
                
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const currentQuestionIndex = ref(0);
const totalCorrectAnswers = ref(0);
// Get the route parameter (id)
const quizId = route.params.id;

// This code should be inside the onMounted function
onMounted(() => {
    // Retrieve the total correct answers from local storage
    const storedAnswers = localStorage.getItem(quizId);
    if (storedAnswers !== null) {
        totalCorrectAnswers.value = parseInt(storedAnswers, 10);
        console.log(`Total Correct Answers for Quiz ${quizId}:`, totalCorrectAnswers.value);
    } else {
        console.log(`No data found for Quiz ${quizId}`);
    }
});
</script>
  