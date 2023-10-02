<template>
    <div class="w-full mx-auto relative flex flex-col  justify-center my-4  items-stretch text-center max-w-2xl font-ckb  bg-transparent border border-transparent text-gray-100 rounded-3xl px-4 md:px-8 text-lg font-semibold"
        :class="startAnimation">
        <div class="space-y-3 ">
            <h1 class="text-center text-3xl md:text-3xl text-indigo-500">بەخێربێی گیان</h1>
            <p class="text-2xl md:text-2xl text-gray-300 hyphens-auto">هەرگیز بیرت لەوە کردۆتەوە هاوڕێکانت تاچەنێک ئەتناسن؟
            </p>
            <p class="text-lg md:text-xl text-gray-400">وەرە با چەند پرسیارێکیان لێ بکەین و تاقیان بکەینەوە👀
            </p>
        </div>
        <img src="../assets/images/friends.png" class="scale-x-110 scale-y-125 sm:-my-16 -my-10 " alt="" />
        <div class="bg-bgray rounded-3xl p-8  text-right space-y-2 py-8 mb-4 text-gray-400 font-bold ">
            <div class="flex  items-center ">
                <div class="rounded-full px-2 py-1 text-2xl text-gray-300 bg-sky-500">1</div>
                <div class="text-lg md:text-2xl mr-3">پرسیارەکانت دروست بکە </div>
            </div>
            <div class="flex items-center ">
                <span class="rounded-full px-2 py-1 text-2xl text-gray-300 bg-pink-600 ">2</span>
                <span class="text-lg md:text-2xl mr-3"> هاوبەشێ بکە لەگەڵ هاوڕێکانت</span>
            </div>
            <div class=" flex  items-center ">
                <span class="rounded-full px-2 py-1 text-2xl text-gray-300 bg-yellow-600">3</span>
                <span class="text-lg md:text-2xl mr-3">سەیری ئەنجامەکان بکەو, باشترین هاوڕێت بدۆزەرەوە</span>
            </div>
        </div>

        <div class="relative">
            <input v-model.trim="name" maxlength="16" @input="validateInput" placeholder="ناوەکەتم پێبڵێ دڵە"
                class="bg-transparent text-xl space-x-6 border-[3.5px] text-right  outline-none focus:outline-none focus:border-sky-800 hover:border-blue-800 whitespace-pre-wrap border-zinc-700 rounded-2xl w-full px-4 h-16">
            <span v-if="name !== ''" class="text-gray-400 text-xs absolute left-4 bottom-4">{{ name.length + "/16" }}</span>
            <div v-if="error || name !== ''" class="text-rose-500  my-2">{{ error }}</div>
        </div>
        <button @click.prevent="start" v-if="name"
            class="py-3 mb-2 bg-indigo-700 rounded-2xl font-bold w-full my-4 animate-bounce ">
            با دەست پێبکەین
        </button>
    </div>
</template>
  
<script setup>
import { ref, defineEmits, onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const name = ref(localStorage.getItem('name') || "");
const emits = defineEmits();
const error = ref("");
const startAnimation = ref("")
const start = () => {
    startAnimation.value = 'transition-all duration-700  scale-50';
    setTimeout(() => {
        localStorage.setItem("name", name.value);
        emits('startClicked');
    }, 270);
};
const validateInput = () => {
    const kurdishCentralRegex = /^[ئابپتجچحخدذرزژسشعغفقەکگلمنهوۆی]/i;
    if (!kurdishCentralRegex.test(name.value)) {
        name.value = name.value.replace(/[^ئابپتجچحخدذرزژسشعغفقکگلمەنهوۆی]/ig, '');
        error.value = 'تەنها پیتە کوردیەکان ڕێگە پێدراوە :)';
    } else {
        error.value = ''; 
    }
};
// onMounted(() => {
//     if (localStorage.getItem("yourQuizId")) {
//         router.push({ name: 'quizes.copy' })
//     }
// });
</script>