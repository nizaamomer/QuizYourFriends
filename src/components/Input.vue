<template>
    <div class="relative">
        <input :value="modelValue" @input="updateValue" maxlength="16" placeholder="ناوەکەتم پێبڵێ دڵە"
            class="bg-transparent text-xl space-x-6 border-[3.5px] text-right outline-none focus:outline-none focus:border-indigo-800 hover:border-sky-800 whitespace-pre-wrap focus:bg-black border-zinc-700 rounded-2xl w-full px-4 h-16" />
        <span v-if="modelValue !== ''" class="text-gray-400 text-xs absolute left-3 bottom-2">
            {{ modelValue.length + "/16" }}
        </span>
        <div v-if="error !== ''" class="text-rose-500 my-2">{{ error }}</div>
    </div>
</template>
  
<script setup>
import { ref } from 'vue';
const { modelValue } = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);
const error = ref('');
const updateValue = (event) => {
    let name = event.target.value;
    const kurdishCentralRegex = /^[ئابپتجچحخدذرزژسشعغفقەکگلمنهوۆی]/i;
    if (!kurdishCentralRegex.test(name)) {
        name = name.replace(/[^ئابپتجچحخدذرزژسشعغفقکگلمەنهوۆی]/ig, '');
        error.value = 'تەنها پیتە کوردیەکان ڕێگە پێدراوە :)';
    } else {
        error.value = '';
    }
    emit('update:modelValue', name);
};

</script>
  