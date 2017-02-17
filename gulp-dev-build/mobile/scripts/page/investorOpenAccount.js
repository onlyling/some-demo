/*
 *投资人开户
 *updata 2015.08.25 sanmiao
 */
define(function(require, exports, module) {
	var site = require('config')('user', '投资人开户');
	//用户登录
	if (!site.userInfo.isLogin) {
		window.location.href = '/mobile/login.html';
	}
	$.showPreloader();
	setTimeout(function() {
		$.hidePreloader();
	}, 400);

	var regForm = $('#reg');
	//token
	var TOKEN = 0, //注册token
		TYPE; //可注册用户类型
	var userName, //用户名
		realName, //真实姓名
		mobile, //手机号码
		email, //电子邮箱
		verifyObj = {
			userName: false,
			realName: false,
			mobile: false,
			email: false
		}, //验证对象
		verifyObjName = { //验证对象对应中文
			userName: '用户名',
			realName: '真实姓名',
			mobile: '手机号码',
			email: '电子邮箱'
		};
	//获取token
	site.ajax({
		url: '/app/investorOpenAccount.htm',
		success: function(res) {
			if (res.code === 1) {
				TOKEN = res.token;
				TYPE = res.type;
			} else {
				alert(res.message);
			}
		}
	});
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
	regForm.on('change', '#userName', function() {
		//用户名
		var _thisVal = $(this).val();
		if (!_thisVal) {
			verifyObj.userName = false;
		} else {
			site.ajax({
				url: '/app/verifyUser.htm?userName=' + _thisVal,
				success: function(res) {
					if (res.code === 1) {
						verifyObj.userName = true;
						userName = _thisVal;
					} else {
						verifyObj.userName = false;
						$.alert(res.message, '提示', function() {
							regForm.find('#userName').focus();
						});
					}
				}
			});
		}
	}).on('change', '#realName', function() {
		//用户名
		var _thisVal = $(this).val();
		if (!_thisVal) {
			verifyObj.realName = false;
		} else {
			verifyObj.realName = true;
			realName = _thisVal;
		}
	}).on('change', '#mobile', function() {
		//电话号码
		var _thisVal = $(this).val();
		if (!_thisVal) {
			verifyObj.mobile = false;
		} else {
			if ((/^1[3|4|5|8][0-9]\d{4,8}$/).test(_thisVal) && _thisVal.length == 11) {
				verifyObj.mobile = true;
				mobile = _thisVal;
			} else {
				verifyObj.mobile = false;
			}
		}
	}).on('change', '#email', function() {
		//电子邮箱
		var _thisVal = $(this).val();
		if (!_thisVal) {
			verifyObj.email = false;
		} else {
			if ((/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/).test(_thisVal)) {
				verifyObj.email = true;
				email = _thisVal;
			} else {
				verifyObj.email = false;
			}
		}
	}).on('click', '#submit', function() {
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
					url: '/app/appOpenInvestor.htm',
					data: {
						userName: userName,
						realName: realName,
						mobile: mobile,
						mail: email,
						token: TOKEN,
						type: TYPE
					},
					success: function(res) {
						if (res.code === 1) {
							$.alert(res.message, '提示', function() {
								window.location.href = '/mobile/customerManager.html';
							});
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