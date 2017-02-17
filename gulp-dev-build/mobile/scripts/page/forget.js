/*
 *找回密码
 *updata 2015.08.25 sanmiao
 */
define(function(require, exports, module) {
	var site = require('config')('user', '找回密码');
	//用户登录
	if (site.userInfo.isLogin) {
		window.location.href = site.config.indexUrl;
	}
	var isGetCode = false, //是否获取验证码
		pwd, //缓存密码
		mobile, //缓存手机号
		step1 = $('#step1'),
		step2 = $('#step2');
	step1.on('click', '#nextBtn', function() {
		var _name = step1.find('#userName').val();
		if (_name) {
			var _this = $(this);
			if (_this.hasClass('ing')) {
				return;
			}
			_this.addClass('ing');
			$.showPreloader('核实中..');
			site.ajax({
				url: '/app/forgetLoginPwd.htm?userName=' + _name,
				success: function(res) {
					$.hidePreloader();
					if (res.code === 1) {
						mobile = res.mobile;
						step1.addClass('fn-hide');
						step2.removeClass('fn-hide').find('#mobile').val(res.mobile.substr(0, 3) + '*****' + res.mobile.substr(-3));
					} else {
						$.alert(res.message, '提示');
					}
				}
			});
		} else {
			$.alert('请填写用户名', '提示');
		}
	});
	step2.on('click', '#getCode', function() {
		var _this = $(this).attr('disabled', 'disabled');
		$.showIndicator();
		site.ajax({
			url: '/app/sendSmsCode.htm?business=ForgetLoginPassWord&mobile=' + mobile,
			success: function(res) {
				$.hideIndicator();
				if (res.code === 1) {
					$.alert('短信发送成功~', '提示');
					isGetCode = true;
					_this.val('30秒').removeClass('button-fill');
					setTimeout(function() {
						_this.removeAttr('disabled').addClass('button-fill').val('获取');
					}, 30000);
				} else {
					$.alert(res.message, '提示');
					setTimeout(function() {
						_this.removeAttr('disabled');
					}, 3000);
				}
			},
			error: function(res) {
				$.hideIndicator();
				$.alert('服务器异常，请稍后获取~', '提示');
				setTimeout(function() {
					_this.removeAttr('disabled');
				}, 3000);
			}
		});
	}).on('change', '#password', function() {
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
					password = res.password;
				}
			});
		} else {
			$.alert('请输入合适的密码~', '提示');
		}
	}).on('click', '#saveBtn', function() {
		if (isGetCode) {
			if (password) {
				$.showPreloader();
				setTimeout(function() {
					site.ajax({
						url: '/app/forgetLoginPwdSub.htm?code=' + document.getElementById('code').value + '&newPassword=' + password,
						success: function(res) {
							$.hidePreloader();
							if (res.code === 1) {
								$.alert(res.message, function() {
									window.location.href = '/mobile/login.html';
								});
							} else {
								$.alert(res.message);
							}
						}
					});
				}, 1000);
			} else {
				$.alert('请填写新密码', '提示');
			}
		} else {
			$.alert('请先获取验证码', '提示');
		}
	});
});