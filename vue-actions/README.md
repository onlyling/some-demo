# Vue 移动端 一个 actions 小组件

> 灵感来源 SUI Mobile

## 下载

复制整个文件夹(vue-actions)到对应的项目。

## 使用


``` javascript
import Vue from 'vue'
import Actions from 'your path /vue-actions'

Vue.use(Actions)

const actionsClick = (obj) => {
    console.log(obj) // params
}

let __buttons = [{
    text: '请选择在线的客服',
    label: true
}, {
    text: '客服名称1',
    onClick: actionsClick,
    params: {
        name: '客服名称1',
        id: 1
    }
}, {
    text: '客服名称2',
    onClick: actionsClick,
    params: {
        name: '客服名称1',
        id: 1
    }
}, {
    text: '客服名称3',
    onClick: actionsClick,
    params: {
        name: '客服名称1',
        id: 1
    }
}]


// new 之前使用
Vue.prototype.$actions(__buttons)

// 某个组件中使用

this.$actions(__buttons)

```

