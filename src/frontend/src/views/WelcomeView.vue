<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const gotoEditor = () => {
    router.push('/editor');
};

</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="text-center">
            <h1 class="text-5xl font-extrabold mb-6 -skew-y-6 text-black bg-gradient-to-r from-theme-purple via-theme-navy via-theme-teal via-theme-lime to-theme-yellow">
                Easyplotlib
            </h1>
            <p class="text-lg text-gray-700 mb-12">Web-based Editor for Matplotlib. Easy to use.</p>
            <button
                @click="gotoEditor"
                class="bg-theme-navy rounded-full py-2 px-4 transition-colors duration-100 hover:bg-theme-teal focus:bg-theme-teal active:bg-theme-lime focus:ring-4 focus:ring-theme-lime">
                <span class="text-white mr-3">Get Started</span>
                <i class="pi pi-angle-double-right text-white"></i>
            </button>
        </div>
    </div>
</template>

<style scoped>
@keyframes gradient {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}
</style>