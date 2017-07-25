# Vue 顶部进度小组件

> 还有点小问题，如果不是点击切换太快，问题不大

## 下载

复制整个文件夹(vue-progress)到对应的项目。

## 使用

``` javascript
import Vue from 'vue'
import Progress from 'your path /vue-progress'

Vue.use(Vue)

// new 之前使用
Vue.prototype.$progress.start()  // 默认进度 80%

Vue.prototype.$progress.start(20) // 进度 20%

Vue.prototype.$progress.end() // 结束 100% ,然后消失

Vue.prototype.$progress.fail() // 当前进度停止，并显示红色

// 某个组件中使用

this.$progress.start()

this.$progress.start(20)

this.$progress.end()

this.$progress.fail()

```

## 问题

在 `end` 的时候，使用了时间延迟，所以，快速改变进度的时候，会出现进度倒流。

例如，在一次 `end` 后快速 `start` ，进度条会从 100% “回退到”指定进度。

项目中也没有类似的快速切换，所以就没有修复这个问题。

## 路由切换，一个假进度

``` javascript

var ROUTER_ENTER_TIME = 0

// 页面加载效果
router.beforeEach((to, from, next) => {
    document.title = to.meta.title || '附近优选'
    if (ROUTER_ENTER_TIME != 0) {
        // 避免 iOS 的 Safari 刷新页面出现两个进度条
        Vue.prototype.$progress.start(20)
    }
    ROUTER_ENTER_TIME ++
    next()
})

router.afterEach((route) => {
    if (ROUTER_ENTER_TIME !== 1) {
        Vue.prototype.$progress.end()
    }
})

```

