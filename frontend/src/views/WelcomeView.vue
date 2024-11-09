<script setup>
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
const router = useRouter();

</script>

<template>
    <div class="flex items-center justify-center bg-gray-100 dark:bg-zinc-800">
        <div class="text-center">
            <h1
                class="text-5xl font-extrabold mb-6 -skew-y-6 text-black bg-gradient-to-r from-theme-purple via-theme-navy via-theme-teal via-theme-lime to-theme-yellow">
                Easyplotlib
            </h1>
            <p class="text-lg text-gray-700 dark:text-gray-100 mb-12">Web-based Editor for Matplotlib. Easy to use.</p>
            <RouterLink to="/editor">
                <Button rounded raised label="Get Started" iconPos="right" icon="pi pi-angle-double-right" class="bg-yellow-300" />
            </RouterLink>
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