import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip';
import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'
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

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(PrimeVue, {
    theme: {
        preset: MyPreset,
        options: {
            prefix: 'p',
            darkModeSelector: 'system',
            cssLayer: false
        }
    }
})

app.directive('tooltip', Tooltip)

app.mount('#app')
