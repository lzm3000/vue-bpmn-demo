import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const CreateProcess = () => import('../components/CreateProcess.vue')
const router = new Router({
  routes: [{
      path: '/',
      name: 'CreateProcess',
      component: CreateProcess
    }

      ]
    })

export default router;
