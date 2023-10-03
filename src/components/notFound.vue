<template>
    <div dir="rtl"
        class=" mx-auto relative  flex flex-col bg-zinc-950 h-screen w-screen justify-center  items-stretch text-center  font-ckb  bg-transparent border border-transparent text-gray-100  px-4 md:px-8 text-lg font-semibold">
        <div class="space-y-16 w-full -mt-16">
            <div>
                <h1 class="text-center text-2xl  text-gray-500 my-3">بەتەمای کوێ بووی دڵە؟</h1>
                <img src="../assets/images/hm.jpg" alt="hmm image" class="mx-auto  w-56 rounded-xl mb-10">
                <h1 class="text-8xl text-indigo-500">404</h1>
                <p class="text-gray-500">نەدۆزرایەوە...</p>
            </div>
            <div class="space-y-3">
                <p class="text-2xl md:text-2xl text-gray-400 hyphens-auto"> وادیارە کەسێک ون بووە لێرە 👀</p>
                <p class="text-lg md:text-xl text-rose-500">پێدەچێت هاوڕێکەت پرسیارەکانی سڕیبێتەوە...</p>
                <div>
                    <br>
                    <router-link :to="{ name: 'home' }"
                        class="py-2.5 mt-20 px-10 bg-indigo-700 rounded-full text-green-100  font-bold  animate-bounce ">بمبەرەوە
                        بۆ ماڵەوە</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

