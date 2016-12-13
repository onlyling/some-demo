export default [{
    path: '/companyCustomer/list', // 企业客户列表
    name: 'companyCustomerList',
    component: function (resolve) {
        require(['../views/customer/companyCustomer/list.vue'], resolve)
    }
}, {
    path: '/companyCustomer/add', // 企业客户新增
    name: 'companyCustomerAdd',
    component: function (resolve) {
        require(['../views/customer/companyCustomer/edit.vue'], resolve)
    }
}, {
    path: '/companyCustomer/edit', // 企业客户编辑
    name: 'companyCustomerEdit',
    component: function (resolve) {
        require(['../views/customer/companyCustomer/edit.vue'], resolve)
    }
}, {
    path: '/companyCustomer/view', // 企业客户查看
    name: 'companyCustomerView',
    component: function (resolve) {
        require(['../views/customer/companyCustomer/view.vue'], resolve)
    }
}, {
    path: '/companyCustomer/audit', // 企业客户编辑
    name: 'companyCustomerAudit',
    component: function (resolve) {
        require(['../views/customer/companyCustomer/view.vue'], resolve)
    }
}]