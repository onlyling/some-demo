/*
 *用户中心
 *引用 require('config')('user', '用户中心');
 *必须操作
 *
 *updata 2015.08.25 sanmiao
 */
define(function(require, exports, module) {
	var site = require('config')('user', '用户中心');
	if (!site.userInfo.isLogin) {
		window.location.href = '/mobile/login.html';
	}
	var oldPwd, //旧密码
		newPwd, //新密码
		isPwd = false; //确认密码
	var pwdBox = $('#pwdBox');
	pwdBox.on('blur', '#old', function() {
		var _thisVal = $(this).val();
		if (!_thisVal) {
			return;
		}
		//对密码加密
		site.ajax({
			url: '/anon/encodePwd',
			data: {
				password: _thisVal
			},
			success: function(res) {
				oldPwd = res.password;
			}
		});
	}).on('blur', '#new', function() {
		var _thisVal = $(this).val();
		var psw1 = /^[0-9]+$/;
		var psw2 = /[\u4e00-\u9fa5]/;
		if (!psw1.test(_thisVal) && !psw2.test(_thisVal) && _thisVal !== '' && 6 <= _thisVal.length && _thisVal.length <= 16) {
			//对密码加密
			site.ajax({
				url: '/anon/encodePwd',
				data: {
					password: _thisVal
				},
				success: function(res) {
					newPwd = res.password;
				}
			});
		} else {
			$.alert('密码格式有误', '提示');
		}
	});
	$('#pwdBtn').on('click', function() {
		if (!oldPwd) {
			$.alert('请先填写旧密码', '提示');
			return;
		}
		if (!newPwd) {
			$.alert('请填写新密码', '提示');
			return;
		}
		if (pwdBox.find('#new').val() !== pwdBox.find('#isnew').val()) {
			$.alert('两次新密码不一致，请再次确认~', '提示');
			return;
		}
		site.ajax({
			url: '/app/appChangePwd.htm?password=' + oldPwd + '&newPassword=' + newPwd,
			success: function(res) {
				if (res.code === 1) {
					site.delSession('userInfo');
					$.alert('成功修改，现在重新登录', '提示', function() {
						window.location.href = '/mobile/login.html';
					});
				} else {
					$.alert(res.message, '提示');
				}
			}
		});
	});
});