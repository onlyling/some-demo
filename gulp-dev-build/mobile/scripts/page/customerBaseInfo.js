/*
 *用户中心
 *引用 require('config')('user', '客户管理');
 *必须操作
 *
 *updata 2015.08.25 sanmiao
 */
define(function(require, exports, module) {
	var site = require('config')('user', '客户详情');
	if (!site.userInfo.isLogin) {
		window.location.href = '/mobile/login.html';
	}
	var customerId = site.getParam('customerId'),
		saveBtn = $('#saveBtn'),
		tblBaseId;
	$.showPreloader();
	//模板方法
	template.helper('hasVal', function(v, t) {
		return v ? v : t;
	});
	template.helper('getCertNo', function(v) {
		return v.substr(0, 3) + '***********' + v.substr(-4);
	});
	site.ajax({
		url: '/app/appCustomerBaseInfo.htm?customerId=' + customerId,
		success: function(res) {
			$.hidePreloader();
			if (res.code === 1) {
				document.getElementById('userInfo').innerHTML = template('t-userInfo', res);
				document.getElementById('note').value = res.customerBaseInfo.note;
				document.getElementById('limit').value = res.customerBaseInfo.profit;
				tblBaseId = res.customerBaseInfo.tblBaseId;
			} else {
				$.alert(res.message, '提示');
			}
		}
	});
	//保存
	saveBtn.on('click', 'a.button', function() {
		site.ajax({
			url: '/app/appSetQuota.htm?customerId=' + customerId + '&tblBaseId=' + tblBaseId + '&limit=' + document.getElementById('limit').value + '&note=' + document.getElementById('note').value,
			success: function(res) {
				$.alert(res.message, '提示');
			}
		});
	});
});