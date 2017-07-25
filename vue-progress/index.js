import Progress from './progress'

const install = function (Vue, opts = {}) {
    Vue.prototype.$progress = Progress
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    version: '0.0.1',
    install
}