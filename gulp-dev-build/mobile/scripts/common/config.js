/*
 *全站配置文件
 *功能确定
 *渲染页头、页尾
 */
define(function(require, exports, module) {
	'use strict';
	//var template = require('template');
	//功能配置
	var config = {
		appName: '小7金融', //app名称(项目名称)
		indexUrl: '/mobile/index.html', //首页url
		userUrl: '/mobile/user.html', //用户中心url
		IDCardIsSole: false, //实名认证时是否唯一身份证号码
		tel: '4000-622-999', //客服电话
		transfer: true, //是否开启债权转让
		hasMore: false, //是否开启更多(新闻列表/关于我们等)
		hasWeakness: false //是否开启弱实名
	};
	/*
	 * 渲染页面页头页尾，通过参数(nav)激活选中状态，最后返回配置对象
	 * @method 匿名函数
	 * @for 所属类名
	 * @param {string} 工具栏别名，具体哪个使用哪个别名，请到渲染页尾js文件查找
	 * @param {string} 当前标题
	 * @return {object} 全站配置文件，通过这个配置文件确定用户和具体的功能模块
	 */
	return function(nav, title) {
		var userInfo = {};

		function getUserInfo() {
			$.ajax({
				url: '/app/appMeAccount.htm',
				type: 'POST',
				dataType: 'json',
				async: false,
				success: function(res) {
					if (res.code === 1) {
						userInfo.userName = res.list[0].userName;
					}
				}
			});
		}
		//是否支持 sessionStorage
		if (window.sessionStorage) {
			var THISTIME = (new Date()).getTime();
			window.sessionStorage.thistime = THISTIME;
			//sessionStorage 是否能读取值
			if (window.sessionStorage.thistime === (THISTIME + '')) {
				if (window.sessionStorage.userInfo) {
					userInfo = JSON.parse(window.sessionStorage.userInfo);
				}
			} else {
				getUserInfo();
			}
		} else {
			getUserInfo();
		}
		userInfo.isLogin = userInfo.userName ? true : false;
		//暴露数据
		var site = {
			title: title || config.appName, //站点标题
			config: config, //站点配置文件
			userInfo: userInfo, //用户信息
			setSession: function(key, obj) {
				//存储
				if (window.sessionStorage) {
					window.sessionStorage[key] = JSON.stringify(obj);
				}
			},
			getSession: function(key) {
				//获取
				if (window.sessionStorage) {
					return window.sessionStorage[key] ? JSON.parse(window.sessionStorage[key]) : {};
				} else {
					return {};
				}
			},
			delSession: function(key) {
				if (window.sessionStorage) {
					window.sessionStorage[key] = '';
				}
			},
			getParam: function(e) {
				var t = window.location.href,
					n = t.indexOf('?'),
					a = t.indexOf('#');
				if (-1 == n)
					return e ? '' : {};
				for (var r = t.substring(n + 1, -1 == a ? t.length : a), i = r.split('&'), o = {}, s = 0; s < i.length; s++) {
					var d = i[s].split('=');
					o[decodeURIComponent(d[0])] = decodeURIComponent(d[1]);
				}
				return e ? o[e] : o;
			},
			ajax: function(obj) {
				var o = {
					url: obj.url || null,
					data: obj.data || null,
					async: obj.async,
					success: obj.success || null,
					error: obj.error || function(res) {
						$.alert('服务器异常，刷新浏览器重试~');
					}
				};
				return $.ajax({
					url: o.url,
					type: 'POST',
					dataType: 'json',
					data: o.data,
					async: o.async,
					success: o.success,
					error: o.error
				});
			},
			isEmpty: function(obj) {
				for (var name in obj) {
					return false;
				}
				return true;
			},
			cacheTime: 5 * 60 * 1000
		};
		/*
		 *快速渲染页面
		 *@param {string} html的id,
		 *@param {template} template的模板文件
		 *@param {object} 模板数据(site)
		 */
		function render(id, tpl, date) {
			// var _render = template.compile(tpl);
			// document.getElementById(id).innerHTML = _render(date);
			document.getElementById(id).innerHTML = template.compile(tpl)(date);
		}
		//title
		document.title = site.title;
		//渲染页头
		if (document.getElementById('uiHeader')) {
			var HEADER = ['{{if userInfo.isLogin}}',
				'<a class="icon icon-me pull-right" href="{{config.userUrl}}"></a>',
				'{{else}}',
				'<a class="button pull-right" href="/mobile/login.html">登录</a>',
				'{{/if}}',
				'<h1 class="title">{{title}}</h1>'
			].join('');
			render('uiHeader', HEADER, site);
		}
		//渲染工具栏
		if (document.getElementById('uiFooter')) {
			var FOOTERS = {
				index: nav,
				list: [{
					icon: 'icon-home',
					link: 'index.html',
					name: '首页',
					alias: 'index'
				}, {
					icon: 'icon-star',
					link: 'invests.html',
					name: '投资',
					alias: 'invest'
				}]
			};
			FOOTERS.list.push({
				icon: 'icon-me',
				link: userInfo.isLogin ? 'user.html' : 'login.html',
				name: '我的',
				alias: 'user'
			});
			if (config.hasMore) {
				FOOTERS.list.push({
					icon: 'icon-app',
					link: 'more.html',
					name: '更多',
					alias: 'more'
				});
			}
			var FOOTER = ['{{each list as item i}}',
				'<a class="tab-item{{if item.alias==index}} active{{/if}}" href="/mobile/{{item.link}}">',
				'<span class="icon {{item.icon}}"></span>',
				'<span class="tab-label">{{item.name}}</span>',
				'</a>',
				'{{/each}}'
			].join('');
			render('uiFooter', FOOTER, FOOTERS);
		}
		//用户登录状态监测
		if (site.userInfo.isLogin) {
			if (site.getSession('loginTime').time) {
				if ((new Date()).getTime() - parseInt(site.getSession('loginTime').time, 10) > site.cacheTime) {
					site.ajax({
						url: '/app/keepConnecting.htm',
						success: function(res) {
							if (res.code === 1) {
								site.setSession('loginTime', {
									time: (new Date()).getTime()
								});
							} else {
								window.sessionStorage.clear();
								$.alert(res.message, '提示', function() {
									window.location.href = '/mobile/login.html';
								});
							}
						}
					});
				}
			} else {
				site.setSession('loginTime', {
					time: (new Date()).getTime()
				});
			}
		}
		//全局方法
		//取消输入支付密码 刷新当前页面
		window.payPassCancel = function() {
			window.location.reload(true);
		};
		return site;
	};
});