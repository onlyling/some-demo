/*
 *用户中心
 *引用 require('config')('user', '用户中心');
 *必须操作
 *
 *updata 2015.08.25 sanmiao
 */
define(function(require, exports, module) {
	var site = require('config')('user', '用户中心');
	var hasRA = require('hasRA'); //是否实名认证、是否开通第三方账户
	if (!site.userInfo.isLogin) {
		window.location.href = '/mobile/login.html';
	}
	var activeAccount = {};
	if (((new Date()).getTime() - parseInt(site.getSession('activeAccount').firstTime, 10)) < site.cacheTime) {
		activeAccount = site.getSession('activeAccount');
	}
	$.showPreloader();
	//债权转让
	if (site.config.transfer) {
		$('li.transfer').removeClass('fn-hide');
	}
	//获取数据后的回调函数
	function ajaxCallBack(res) {
		document.getElementById('userInfo').innerHTML = template('t-userInfo', res);
		document.getElementById('userMoney').innerHTML = template('t-userMoney', res);
		site.setSession('activeAccount', activeAccount);
		//经纪人
		if (res.list[1].consumerManager === '1') {
			$('li.NOGR').removeClass('fn-hide');
		}
		//登录后回调
		if (site.getSession('beforeLogin').url) {
			$.confirm('是否返回登录前的页面？', function() {
				var _url = site.getSession('beforeLogin').url;
				site.delSession('beforeLogin');
				window.location.href = _url;
			});
		}
	}
	if (site.getSession('activeAccount').list && activeAccount.refreshTime < 3) {
		$.hidePreloader();
		++activeAccount.refreshTime;
		ajaxCallBack(activeAccount);
	} else {
		site.ajax({
			url: '/app/appMeAccount.htm',
			success: function(res) {
				$.hidePreloader();
				if (res.code === 1) {
					activeAccount = res;
					activeAccount.refreshTime = 1;
					activeAccount.firstTime = (new Date()).getTime(); //当前时间
					ajaxCallBack(res);
				} else {
					$.alert(res.message, '提示', function() {
						window.sessionStorage.clear();
						window.location.href = '/mobile/login.html';
					});
				}
			}
		});
	}
	//充值、提现 通过实名、开户等才能进行
	$('#user').on('click', 'a.recharge', function() {
		hasRA(site, function() {
			window.location.href = '/mobile/recharge.html';
		});
	}).on('click', 'a.withdraw', function() {
		hasRA(site, function() {
			window.location.href = '/mobile/withdraw.html';
		});
	});
	//退出登录
	$('#exit').on('click', function() {
		site.ajax({
			url: '/app/logout.htm',
			success: function(res) {
				if (res.code === 1) {
					//清空缓存后跳转登录
					window.sessionStorage.clear();
					window.location.href = '/mobile/login.html';
				} else {
					$.alert(res.message);
				}
			}
		});
	});
});