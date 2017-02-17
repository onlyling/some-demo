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
	var email = $('#email'),
		hasEmail = false, //是否输入正确email
		hasGetCode = false, //是否获取验证码
		emailBtn = $('#emailBtn');
	//由于通过手机短信绑定，先判断是否绑定手机号码
	if (site.getSession('accountInfo').mobileBinding !== 'IS') {
		$.alert('您还未绑定手机号码，咱不能进行改绑或绑定邮箱操作', '提示', function() {
			window.location.href = '/mobile/set.html';
		});
	}
	email.on('change', '#newemail', function() {
		var _this = $(this);
		if ((/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/).test(_this.val())) {
			//核实邮箱唯一性
			site.ajax({
				url: '/anon/checkEmailOrMobile?dateTag=' + new Date().getTime() + '&email=' + _this.val() + '&checkType=investor',
				success: function(res) {
					if (res.code === 1) {
						hasEmail = true;
					} else {
						hasEmail = false;
						$.alert(res.message, '提示', function() {
							_this.focus();
						});
					}
				}
			});
		} else {
			$.alert('请输入正确的电子邮箱地址', '提示', function() {
				_this.focus();
			});
		}
	}).on('click', '#getCode', function() {
		var _this = $(this);
		setTimeout(function() {
			if (!hasEmail) {
				$.alert('请输入正确的电子邮箱地址', '提示');
				return;
			}
			if (_this.hasClass('ing')) {
				return;
			}
			_this.addClass('ing');
			site.ajax({
				url: '/app/sendSmsCode.htm?mobile=' + site.getSession('accountInfo').mobile + '&business=personal',
				success: function(res) {
					if (res.code === 1) {
						$.alert('已发送到您绑定的手机号码中~', '提示');
						hasGetCode = true;
						_this.val('30秒').removeClass('button-fill');
						setTimeout(function() {
							_this.removeAttr('disabled').addClass('button-fill').val('获取');
						}, 30000);
					} else {
						$.alert(res.message, '提示');
						hasGetCode = false;
					}
				}
			});
		}, 1000);
	});
	emailBtn.on('click', function() {
		if (!hasEmail) {
			$.alert('请填写邮箱地址', '提示');
			return;
		}
		if (!hasGetCode) {
			$.alert('请先获取验证码', '提示');
			return;
		}
		var _this = $(this);
		if (_this.hasClass('ing')) {
			return;
		}
		_this.addClass('ing');
		site.ajax({
			url: '/app/updateMail.htm',
			data: {
				newMail: document.getElementById('newemail').value,
				code: document.getElementById('code').value
			},
			success: function(res) {
				_this.removeClass('ing');
				if (res.code === 1) {
					$.alert('成功绑定新邮箱', '提示', function() {
						window.location.href = '/mobile/set.html';
					});
				} else {
					$.alert('成功失败，请重新绑定', '提示');
				}
			}
		});
	});
});