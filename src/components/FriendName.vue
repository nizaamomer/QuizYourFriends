<template>
    <div class=" mx-auto flex flex-col  justify-center h-screen items-stretch text-center max-w-2xl   px-4 md:px-10 text-lg"
        :class="startAnimation">
        <div class="space-y-3 ">
            <h1 class="text-center text-3xl md:text-3xl text-indigo-500"> سڵاو چۆنیت؟</h1>
            <p class="text-2xl md:text-2xl leading-relaxed text-gray-400">{{ creatorName }} چەند پرسیارێکی ئامادەکردووە
                ئەیەوێ
                بزانێت تا چەندێک
                ئەیناسیت
            </p>
        </div>
        <div class="my-12">
            <div class="rounded-t-3xl p-6 text-gray-300 bg-rose-700 text-xl sm:text-2xl">
                بیسەلمێنە چەنێک {{ creatorName }} ئەیناسیت 🙃
            </div>
            <div class="bg-bgray rounded-b-3xl p-6 relative ">
                <Input v-model="name" />
                <Button :start="start" :name="name" />
            </div>
        </div>
        <Icons />
    </div>
</template>
<script setup>
import Icons from "@/components/Icons.vue"
import Input from "@/components/Input.vue"
import Button from "@/components/Button.vue"
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import db from '@/firebase';
import { collection, doc, onSnapshot } from 'firebase/firestore';
const route = useRoute();
const router = useRouter();
const name = ref(localStorage.getItem('name') || "");
const emits = defineEmits();
const startAnimation = ref("");
const creatorName = ref("");
const quizzesCollection = collection(db, 'Quizzes');
const quizId = route.params.id;
const start = () => {
    startAnimation.value = 'transition-all duration-700  scale-50';
    setTimeout(() => {
        localStorage.setItem("name", name.value);
        emits('friendClicked');
    }, 270);
};
onMounted(async () => {
    const docRef = doc(quizzesCollection, quizId);
    onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
            creatorName.value = doc.data().creatorName;
        } else {
            router.push({ name: 'notFound' })
        }
    });
});

</script>