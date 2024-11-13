import { createRouter, createWebHistory, type RouteRecordSingleView } from 'vue-router'
import WelcomeView from '@views/WelcomeView.vue'
import AboutView from '@views/AboutView.vue'
import EditorView from '@views/EditorView.vue'

const routes: Array<RouteRecordSingleView> = [
  {
    path: '/',
    name: 'home',
    component: WelcomeView
  },
  {
    path: '/editor/:base64Data?',
    name: 'editor',
    component: EditorView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
