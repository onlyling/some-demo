# Vue 顶部进度小组件

> 还有点小问题，如果不是点击切换太快，问题不大

## 下载

复制整个文件夹(vue-progress)到对应的项目。

## 使用

``` javascript
import Vue from 'vue'
import Progress from 'your path /vue-progress'

Vue.use(Progress)

// new 之前使用
Vue.prototype.$progress.start()  // 默认进度 80%

Vue.prototype.$progress.start(20) // 进度 20%

Vue.prototype.$progress.end() // 结束 100% ,然后消失

Vue.prototype.$progress.fail() // 进度停止，并显示红色

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

## 思路

进度条，从N到100%慢慢加载、变长，使用的时候只需要关系加载到百分之多少。

最开始，过渡使用的是 css3 过渡，但是，没搞好，于是还是做了累加。

累加就避免不了使用时间延迟。

Vue组件，很单纯，只是一个视图，给一个数据，显示出对应的样子。

`./progress/index.js` 主要完成对应的逻辑，例如，格式化输入的格式，统一一个修改组件的方式等等。

### 向外提供的方法

`start` 主要是把输入内容格式化成数组，然后再把进度“合法化(0-100)”

`end` 把进度带向 100%，然后隐藏进度条

`fail` 把进度带向 100%，并且进度条换一个背景色

`reset` 重置进度

### 内部的一些变量

首先不用多说，标准的隐式创建一个Vue实例，把实例插入body尾部，通过修改实例的属性得到想要的样子。

`defaultStyle` 、 `errorStyle` 组件上动态绑定的`style`，会混合 `width` 写到行内样式上。

`defaultSpeed` 、 `endSpeed` 累加、累减的单位大小。

`progressEndTimer` 结束的计时器，到了100%，进度条没有立即消失。

`progressTimer` 进度计时器，每次累加累减就是它完成的。

`progressEnd` 结束的进度。

`progressCurrent` 当前的进度。

`setProgress` 建立进度累加累减，给一个最终的进度，判断前进、后退，在一个计时器里面改变当前的进度，设置组件的状态，领节点的判断等等。
