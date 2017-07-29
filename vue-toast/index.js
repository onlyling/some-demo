import Toast from './toast'

const install = function (Vue, opts = {}) {
    Vue.prototype.$toast = Toast
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    version: '0.0.1',
    install
}