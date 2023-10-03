<template>
    <div>
        <p class="text-indigo-600 hover:text-indigo-700">#{{ visitorCount }} <i
                class="fa-solid fa-eye text-xs text-gray-500 hover:text-indigo-700"></i></p>
    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import db from '@/firebase';
const visitorsCollection = collection(db, 'Visitors');
const visitorCount = ref(0);

const getIpAddress = async () => {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        return response.data.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
        return null;
    }
};

const addIpAddressToFirebase = async (ipAddress) => {
    try {
        const querySnapshot = await getDocs(visitorsCollection);
        const existingVisitor = querySnapshot.docs.find((doc) => doc.id === ipAddress);

        if (!existingVisitor) {
            const visitorDocRef = doc(visitorsCollection, ipAddress);
            await setDoc(visitorDocRef, {
                ipAddress,
                createdAt: new Date(),
            });
        }
    } catch (error) {
        console.error('Error adding IP address to Firestore:', error);
    }
};

const updateVisitorCount = async () => {
    try {
        const querySnapshot = await getDocs(visitorsCollection);
        visitorCount.value = querySnapshot.size;
    } catch (error) {
        console.error('Error fetching visitor count:', error);
    }
};
onMounted(async () => {
    const ipAddress = await getIpAddress();
    if (ipAddress) {
        await addIpAddressToFirebase(ipAddress);
        updateVisitorCount();
    }
});
</script>
  