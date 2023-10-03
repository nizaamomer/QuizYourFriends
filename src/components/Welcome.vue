<template>
    <div id="home" class="w-full mx-auto relative flex flex-col  justify-center my-4  items-stretch text-center max-w-2xl font-ckb  bg-transparent border border-transparent text-gray-100 rounded-3xl px-4 md:px-8 text-lg font-semibold"
        :class="startAnimation">
        <div class="space-y-6 ">
            <h1 class="text-center text-3xl md:text-3xl text-indigo-500">بەخێربێی گیان</h1>
            <p class="text-2xl md:text-2xl text-gray-300 hyphens-auto">هەرگیز بیرت لەوە کردۆتەوە هاوڕێکانت تاچەنێک ئەتناسن؟
            </p>
            <p class="text-lg md:text-xl text-gray-400">وەرە با چەند پرسیارێکیان لێ بکەین و تاقیان بکەینەوە👀
            </p>
            <Guide />
            <Input v-model="name" />
            <Button :start="start" :name="name" />
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Guide from "@/components/Guide.vue"
import Input from "@/components/Input.vue"
import Button from "@/components/Button.vue"
const router = useRouter();
const name = ref(localStorage.getItem('name') || "");
const emits = defineEmits();
const startAnimation = ref("")
const start = () => {
    startAnimation.value = 'transition-all duration-700  scale-50';
    setTimeout(() => {
        localStorage.setItem("name", name.value);
        scrollToTop()
        emits('startClicked');
    }, 270);
};
const scrollToTop = () => {
    const scrollContainer = document.getElementById('home');
    if (scrollContainer) {
        scrollContainer.scrollTop = 0;
    }
}

</script>