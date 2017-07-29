# Vue 移动端 一个 toast 小组件

> 灵感来源 SUI Mobile

## 下载

复制整个文件夹(vue-toast)到对应的项目。

## 使用


``` javascript
import Vue from 'vue'
import Toast from 'your path /vue-toast'

Vue.use(Toast)

// new 之前使用
Vue.prototype.$toast('你要显示的文字') // 弹出层2秒后消失
Vue.prototype.$toast('你要显示的文字', 5 * 1000) // 弹出层5秒后消失

// 某个组件中使用

this.$toast('你要显示的文字')

this.$toast('你要显示的文字', 5 * 1000)

```

## 思路

创建一个弹出层，N秒后消失，然后删除DOM，可能自己有点小洁癖，所以要删了DOM，还原原来的样子。

整个弹出、隐藏的效果都是CSS 3完成，所以，才会在添加激活样式的时候做了一个延迟，要不然，就会很生硬的弹出来。

