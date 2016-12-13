export default [{
    path: '/projectList',
    name: 'projectList',
    component: function (resolve) {
        require(['./views/index.vue'], resolve)
    }
}]