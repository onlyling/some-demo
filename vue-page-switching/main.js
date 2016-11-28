import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Foo = { template: '<div class="ms-page foo"><p><router-link to="/bar">Go to Bar</router-link></p></div>' }
const Bar = { template: '<div class="ms-page bar"><p><router-link to="/foo">Go to Foo</router-link></p><p><router-link to="/bar/1">Go to Bar1</router-link></p></div>' }
const Bar1 = { template: '<div class="ms-page foo"><p><router-link to="/bar">Go to Bar</router-link></p></div>' }

const routes = [
  { path: '/', redirect: '/foo' },
  { path: '/foo', name: 'foo', component: Foo },
  { path: '/bar', name: 'bar', component: Bar },
  { path: '/bar/1', name: 'bar1', component: Bar1 }
]

const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
})

const app = new Vue({
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app')

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   template: '<App/>',
//   components: { App }
// })
