import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// PrimeVue Settings
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip';
import ToastService from 'primevue/toastservice'

// PrimeVue Themes
import { definePreset } from '@primevue/themes'
import Nora from '@primevue/themes/nora'

const MyPreset = definePreset(Nora, {
    semantic: {
        primary: {
            50: '{teal.50}',
            100: '{teal.100}',
            200: '{teal.200}',
            300: '{teal.300}',
            400: '{teal.400}',
            500: '{teal.500}',
            600: '{teal.600}',
            700: '{teal.700}',
            800: '{teal.800}',
            900: '{teal.900}',
            950: '{teal.950}'
        }
    }
})

const PrimeVueCustomTheme = {
    theme: {
        preset: MyPreset,
        options: {
            prefix: 'p',
            darkModeSelector: 'system',
            cssLayer: false
        }
    }
}

createApp(App).use(router)
    .use(PrimeVue, PrimeVueCustomTheme)
    .use(createPinia())
    .use(ToastService)
    .directive('tooltip', Tooltip)
    .mount('#app')
