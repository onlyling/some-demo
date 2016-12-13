import Vue from 'vue'
import VueRouter from 'vue-router'

import commonList from 'components/pages/commonList.vue'
import commonBreadcrumb from 'components/pages/commonBreadcrumb.vue'

import 'assets/webapp.css'

Vue.use(VueRouter)

Vue.component('common-list', commonList)
Vue.component('common-breadcrumb', commonBreadcrumb)

// const router = new VueRouter({
//   routes // （缩写）相当于 routes: routes
// })

// const app = new Vue({
//   router,
//   template: '<App/>',
//   components: {
//     App
//   }
// }).$mount('#app')

export default (routes, App) => {

  const router = new VueRouter({
    routes
  })

  const app = new Vue({
    router,
    template: '<App/>',
    components: {
      App
    }
  }).$mount('#app')

  return {
    router,
    app
  }

}