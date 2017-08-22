import Actions from './actions'

const install = function (Vue, opts = {}) {
    Vue.prototype.$actions = Actions
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    version: '0.0.1',
    install
}