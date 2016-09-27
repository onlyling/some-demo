'use strict'

export default function(router) {
	router.map({
		'/home': { // 首页
			name: 'home',
			component: function(resolve) {
				require(['../views/home/index.vue'], resolve)
			}
		},
		'*': {
			component: function(resolve) {
				require(['../views/home/index.vue'], resolve)
			}
		},
		'/list': { // 主页
			name: 'list',
			component: function(resolve) {
				require(['../views/home/list.vue'], resolve)
			}
		}
	})
	router.redirect({
		'/': "/home"
	})
}