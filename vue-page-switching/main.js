import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Foo = { template: '<div class="ms-page foo"><p><router-link to="/bar">Go to Bar</router-link></p></div>' }
const Bar = { template: '<div class="ms-page bar"><p><router-link to="/foo">Go to Foo</router-link></p><br><br><br><p><router-link to="/bar/1">Go to Bar1</router-link></p></div>' }
const Bar1 = { template: '<div class="ms-page bar2"><p><router-link to="/bar">Go to Bar</router-link></p><br><br><br><p><router-link to="/bar/1/2">Go to Bar12</router-link></p></div>' }
const Bar12 = { template: '<div class="ms-page bar"><p><router-link to="/bar">Go to Bar</router-link></p><br><br><br><p><router-link to="/bar/1">Go to Bar1</router-link></p></div>' }

const routes = [
  { path: '/', redirect: '/foo' },
  { path: '/foo', name: 'foo', component: Foo, meta: { isfade: true } },
  { path: '/bar', name: 'bar', component: Bar, meta: { isfade: true } },
  { path: '/bar/1', name: 'bar1', component: Bar1, meta: { goback: true } },
  { path: '/bar/1/2', name: 'bar12', component: Bar12, meta: { goback: true } }
]

const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
})

// 记录路由改变的次数，避免页面刷新后，右进入
var IS_ROUTER_FIRST_CHANGE = true

router.beforeEach((to, from, next) => {

  let direction = 'slide-fade'
  // 上一个页面是否是返回？
  if (!!from.meta.goback) {
    // 如果两个页面都有callback，比较路由深度
    if (!!to.meta.goback) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      direction = toDepth >= fromDepth ? 'slide-right' : 'slide-left'
    } else {
      direction = 'slide-left'
    }
  } else {
    // 下个页面是否是返回？
    direction = !!to.meta.goback ? 'slide-right' : 'slide-fade'
  }

  if (IS_ROUTER_FIRST_CHANGE) {
    IS_ROUTER_FIRST_CHANGE = !IS_ROUTER_FIRST_CHANGE
    direction = 'slide-fade'
  }

  router.app.pageTransition = direction

  next()

})

// router.beforeEach((to, from, next) => {

//   const toDepth = to.path.split('/').length
//   const fromDepth = from.path.split('/').length
//   console.log(toDepth)
//   if (toDepth === 2) {
//     router.app.pageTransition = 'slide-fade'
//   } else {
//     router.app.pageTransition = toDepth >= fromDepth ? 'slide-right' : 'slide-left'
//   }
//   next()

// })

// router.afterEach((transition) => {
//   console.log(transition.meta.isBack)

//   // if (typeof transition.meta.isBack === 'undefined') {
//   //   router.app.pageTransition = 'null'
//   // } else {

//   // }

//   // setTimeout(() => {
//   //   router.app.pageTransition = !!transition.meta.isBack ? 'slide-left' : 'slide-right'
//   // }, 50)


// })

const app = new Vue({
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app')

