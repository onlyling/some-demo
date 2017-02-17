/*
 *用户登录
 *sanmiao@yiji.com
 */
define(function(require, exports, module) {
	var site = require('config')('user', '用户登录');
	//用户登录
	if (site.userInfo.isLogin) {
		window.location.href = site.config.userUrl;
	}
	var USERNAME = '',
		PWD = '';
	//缓存变量
	var _tipTxt = {
		mark: 'danger',
		noTip: '请注意周围环境，切勿泄露个人信息',
		userName: '用户名不能为空~',
		pwd: '密码不能为空',
		ajaxError: '服务器打盹儿了，请稍候再登录~'
	};
	var _tip = $('p.formTip').text(_tipTxt.noTip);
	var _userName = $('#userName');
	var _pwd = $('#pwd');
	//点击登录
	$('#submit').on('click', function() {
		var _this = $(this);
		if (_this.hasClass('ing')) {
			return;
		}
		//延迟
		setTimeout(function() {
			if (!_userName.val()) {
				_tip.text(_tipTxt.userName).addClass(_tipTxt.mark);
			} else if (!_pwd.val()) {
				_tip.text(_tipTxt.pwd).addClass(_tipTxt.mark);
			} else {
				_this.text('登录中...').addClass('ing');
				if (_tip.hasClass(_tipTxt.mark)) {
					_tip.text(_tipTxt.noTip).addClass(_tipTxt.mark);
				}
				window.localStorage.userName = $('#userName').val();
				$.ajax({
					url: '/app/login.htm',
					type: 'POST',
					dataType: 'json',
					data: {
						userName: USERNAME,
						passWord: PWD
					},
					success: function(res) {
						if (res.code == 1) {
							//登录成功 页面跳转
							site.setSession('userInfo', {
								userName: USERNAME,
								realName: res.realName,
								userId: res.userId,
								userType: res.userType
							});
							site.setSession('loginTime', {
								time: (new Date()).getTime()
							});
							window.location.href = site.config.userUrl;
						} else {
							_tip.text(res.message);
							_this.text('登录').removeClass('ing');
						}
					},
					error: function(res) {
						_tip.text(_tipTxt.ajaxError).addClass(_tipTxt.mark);
						_this.text('登录失败');
					}
				});
			}
		}, 500);
	});
	//用户名失焦
	_userName.on('blur', function() {
		if (!this.value) {
			_tip.text(_tipTxt.userName).addClass(_tipTxt.mark);
		} else {
			_tip.text(_tipTxt.noTip).addClass(_tipTxt.mark);
			USERNAME = this.value;
		}
	});
	//密码失焦
	_pwd.on('blur', function() {
		var _thisVal = this.value;
		if (!_thisVal) {
			_tip.text(_tipTxt.pwd).addClass(_tipTxt.mark);
		} else {
			_tip.text(_tipTxt.noTip).addClass(_tipTxt.mark);
			//加密
			$.ajax({
				url: '/anon/encodePwd',
				type: 'POST',
				dataType: 'json',
				data: {
					'password': _thisVal
				},
				success: function(res) {
					PWD = res.password;
				}
			});

		}
	});
});