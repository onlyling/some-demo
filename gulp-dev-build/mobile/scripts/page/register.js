/*
 *用户注册
 *updata 2015.08.25 sanmiao
 */
define(function(require, exports, module) {
	var site = require('config')('user', '用户注册');
	//用户登录
	if (site.userInfo.isLogin) {
		window.location.href = site.config.userUrl;
	}
	// $.showPreloader();
	//缓存变量
	var _tipTxt = {
		mark: 'danger',
		noTip: '请注意周围环境，切勿泄露个人信息',
		userNameNull: '用户名不能为空~',
		userNameRepeat: '用户名已存在',
		pwdNull: '密码不能为空',
		pwd: '登录密码6-16个字符，建议使用字母和数字的组合密码',
		referees: '推荐人号码错误',
		mobileNull: '手机号码不能为空',
		mobileError: '请输入正确的手机号码',
		mobileRepeat: '手机号码已存在',
		ajaxError: '服务器打盹儿了，请稍候再登录~'
	};
	var _tip = $('p.formTip').text(_tipTxt.noTip);
	var regForm = $('#reg');
	//token
	//var TOKEN = 0; //注册token
	var userName = '', //用户名
		mobile = '', //手机号码
		password = '', //登陆密码
		code = '', //短信验证码
		referees = '', //推荐人编号
		verifyObj = {
			userName: false,
			mobile: false,
			password: false,
			code: false,
			referees: true
		}, //验证对象
		verifyObjName = { //验证对象对应中文
			userName: '用户名',
			mobile: '手机号码',
			password: '登录密码',
			code: '验证码',
			referees: '推荐人编号'
		};
	//获取token
	//2016.03.09
	//听说已经不再使用该接口
	// site.ajax({
	// 	url: '/app/toRegisterPage.htm',
	// 	success: function(res) {
	// 		$.hidePreloader();
	// 		if (res.code === 1) {
	// 			TOKEN = res.token;
	// 		} else {
	// 			alert('获取注册信息失败，请刷新浏览器~');
	// 		}
	// 	}
	// });
	//登录后跳转第三方支付
	function toLogin(url) {
		site.ajax({
			url: '/app/login.htm',
			data: {
				userName: userName,
				passWord: password
			},
			success: function(res) {
				if (res.code === 1) {
					site.setSession('userInfo', {
						userName: userName
					});
					$.alert('现在去开通第三方支付账号', '提示', function() {
						window.location.href = url;
					});
				} else {
					$.alert('注册成功，现在去登录', '提示', function() {
						window.location.href = '/mobile/login.html';
					});
				}
			}
		});
	}
	regForm.on('blur', '#userName', function() {
		//用户名失焦
		var _thisVal = $(this).val();
		if (!_thisVal) {
			_tip.text(_tipTxt.userNameNull).addClass(_tipTxt.mark);
			verifyObj.userName = false;
		} else {
			site.ajax({
				url: '/app/verifyUser.htm?userName=' + _thisVal,
				success: function(res) {
					if (res.code === 1) {
						_tip.text(_tipTxt.noTip).removeClass(_tipTxt.mark);
						verifyObj.userName = true;
						userName = _thisVal;
					} else {
						_tip.text(_tipTxt.userNameRepeat).addClass(_tipTxt.mark);
						verifyObj.userName = false;
						$.alert(res.message, '提示', function() {
							regForm.find('#userName').focus();
						});
					}
				}
			});
		}
	}).on('blur', '#mobile', function() {
		//电话号码
		var _thisVal = $(this).val();
		if (!_thisVal) {
			_tip.text(_tipTxt.mobileNull).addClass(_tipTxt.mark);
			verifyObj.mobile = false;
		} else {
			if ((/^1[3|4|5|8][0-9]\d{4,8}$/).test(_thisVal)) {
				_tip.text(_tipTxt.noTip).removeClass(_tipTxt.mark);
				verifyObj.mobile = true;
				mobile = _thisVal;
			} else {
				_tip.text(_tipTxt.mobileError).addClass(_tipTxt.mark);
				verifyObj.mobile = false;
			}
		}
	}).on('blur', '#password', function() {
		//密码失焦
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
					_tip.text(_tipTxt.noTip).removeClass(_tipTxt.mark);
					verifyObj.password = true;
				}
			});
		} else {
			_tip.text(_tipTxt.pwd).addClass(_tipTxt.mark);
			verifyObj.password = false;
		}
	}).on('blur', '#referees', function() {
		//推荐人编号
		var _thisVal = $(this).val();
		if (!_thisVal) {
			_tip.text(_tipTxt.userNameNull).removeClass(_tipTxt.mark);
			verifyObj.referees = true;
		} else {
			site.ajax({
				url: '/app/verifyReferees.htm?referees=' + _thisVal,
				success: function(res) {
					if (res.code === 1) {
						_tip.text(_tipTxt.noTip).removeClass(_tipTxt.mark);
						verifyObj.referees = true;
						referees = _thisVal;
					} else {
						_tip.text(_tipTxt.referees).addClass(_tipTxt.mark);
						verifyObj.referees = false;
					}
				}
			});
		}
	}).on('click', '#getCode', function() {
		//获取验证码
		if (verifyObj.mobile) {
			var _this = $(this).attr('disabled', 'disabled');
			$.showIndicator();
			site.ajax({
				url: '/app/sendSmsCode.htm?business=register&mobile=' + mobile,
				success: function(res) {
					$.hideIndicator();
					if (res.code === 1) {
						$.alert('短信发送成功~', '提示');
						_this.val('30秒').removeClass('button-fill');
						setTimeout(function() {
							_this.removeAttr('disabled').addClass('button-fill').val('获取');
						}, 30000);
						verifyObj.code = true;
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
		} else {
			$.alert('请先填写正确的电话号码~', '提示');
		}
	}).on('click', '#submit', function() {
		_tip.text(_tipTxt.noTip).removeClass(_tipTxt.mark);
		var _this = $(this);
		if (_this.hasClass('ing')) {
			return;
		}
		_this.addClass('ing');
		//延迟1秒，避免blur操作未生效
		setTimeout(function() {
			var errTxt = '';
			for (var key in verifyObj) {
				if (!verifyObj[key]) {
					errTxt += '、' + verifyObjName[key];
				}
			}
			if (errTxt) {
				$.alert(errTxt.substr(1) + '填写错误', '提示');
				_this.removeClass('ing');
			} else {
				site.ajax({
					url: '/app/registerSubmit.htm',
					data: {
						userName: userName,
						mobile: mobile,
						password: password,
						code: document.getElementById('code').value,
						// token: TOKEN,
						wechat: document.getElementById('wechat').value,
						QQ: document.getElementById('QQ').value,
						referees: referees
					},
					success: function(res) {
						if (res.code === 1) {
							var _activeYjfPwdUrl = res.activeYjfPwdUrl;
							//是否有红包
							if (res.giftMoney) {
								$.modal({
									title: '提示',
									text: res.giftMoneyMessage,
									afterText: '<img src="/mobile/img/icon_redPacket.png" width="100%">',
									buttons: [{
										text: '知道了',
										bold: true,
										onClick: function() {
											toLogin(_activeYjfPwdUrl);
										}
									}]
								});
							} else {
								toLogin(_activeYjfPwdUrl);
							}
						} else {
							$.alert(res.message, '提示', function() {
								window.location.reload(true);
							});
						}
					}
				});
			}
		}, 1000);
	});
});