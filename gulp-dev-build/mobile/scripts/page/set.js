/*
 *用户中心
 *引用 require('config')('user', '用户中心');
 *必须操作
 *
 *updata 2015.08.25 sanmiao
 */
define(function(require, exports, module) {
	var site = require('config')('user', '账户管理');
	if (!site.userInfo.isLogin) {
		window.location.href = '/mobile/login.html';
	}
	$.showPreloader();
	//模板方法
	template.helper('getRealName', function(le, ac) {
		var _s;
		if (ac === 'IN') {
			_s = '申请中';
		} else if (ac === 'NO') {
			_s = '未通过';
		} else if (ac === 'N') {
			_s = '未认证';
		} else {
			if (le === '1') {
				_s = '升级';
			} else {
				_s = '已认证';
			}
		}
		return _s;
	});
	site.ajax({
		url: '/app/appAccountInfo.htm',
		success: function(res) {
			$.hidePreloader();
			if (res.code === 1) {
				document.getElementById('user').innerHTML = template('t-user', res);
				site.setSession('accountInfo',res.accountInfo);
			} else {
				$.alert('获取失败，刷新页面~', '提示', function() {
					window.location.reload(true);
				});
			}
		}
	});
});