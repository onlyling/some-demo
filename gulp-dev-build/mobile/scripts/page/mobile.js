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
	var mobileBinding = false, //是否绑定
		oldMobile = 0, //原手机号码
		hasGetCode = false, //是否获取了验证码
		md5ID = 0, //更换 md5 字符串
		mobileBox = $('#mobile'),
		nextBtn = $('#nextBtn');

	site.ajax({
		url: '/app/appAccountInfo.htm',
		success: function(res) {
			$.hidePreloader();
			if (res.code === 1) {
				document.getElementById('mobile').innerHTML = template('t-mobile', res);
				mobileBinding = (res.accountInfo.mobileBinding === 'IS') ? true : false;
				oldMobile = res.accountInfo.mobile;
				if (!mobileBinding) {
					nextBtn.val('立即绑定');
				}
			} else {
				$.alert('获取失败，刷新页面~', '提示', function() {
					window.location.reload(true);
				});
			}
		}
	});
	//callback
	function getCodeCallBack(res, btn) {
		if (res.code === 1) {
			hasGetCode = true;
			$.alert('验证码已发送', '提示');
			btn.val('30秒').removeClass('button-fill');
			setTimeout(function() {
				btn.removeClass('ing').val('获取').addClass('button-fill');
			}, 30000);
		} else {
			hasGetCode = false;
			$.alert(res.message, '提示');
			btn.removeClass('ing');
		}
	}
	//获取验证码
	mobileBox.on('click', '#getCode', function() {
		var _this = $(this);
		if (_this.hasClass('ing')) {
			return;
		}
		_this.addClass('ing');
		if (mobileBinding) {
			//已绑定
			site.ajax({
				url: '/app/sendSmsCode.htm?business=cellphone&mobile=' + oldMobile,
				success: function(res) {
					getCodeCallBack(res, _this);
				}
			});
		} else {
			//未绑定
			if ((/^1[3|4|5|8][0-9]\d{4,8}$/).test(mobileBox.find('#mobile').val())) {
				site.ajax({
					url: '/app/bondingMobile.htm?business=cellphone&mobile=' + mobileBox.find('#mobile').val(),
					success: function(res) {
						getCodeCallBack(res, _this);
					}
				});
			} else {
				$.alert('请输入正确的手机号码', '提示', function() {
					mobileBox.find('#mobile').focus();
					_this.removeClass('ing');
				});
			}
		}
	});
	//下一步
	nextBtn.on('click', function() {
		var _this = $(this);
		if (hasGetCode) {
			if (_this.hasClass('ing')) {
				return;
			}
			_this.addClass('ing');
			if (mobileBinding) {
				//已绑定
				if (_this.hasClass('next')) {
					//验证新号码
					site.ajax({
						url: '/app/appChangeToNewPhone.htm',
						data: {
							code: mobileBox.find('#newcode').val(),
							md5UserBaseId: md5ID,
							newMobile: mobileBox.find('#newmobile').val()
						},
						success: function(res) {
							if (res.code === 1) {
								$.alert('成功绑定~', '提示', function() {
									window.location.href = '/mobile/set.html';
								});
							} else {
								$.alert(res.message, '提示');
								_this.removeClass('ing');
							}
						}
					});
				} else {
					//验证绑定手机号码
					site.ajax({
						url: '/app/appChangeMobile.htm?newMobile=' + mobileBox.find('#newmobile').val() + '&code=' + mobileBox.find('#code').val(),
						success: function(res) {
							if (res.code === 1) {
								md5ID = res.md5UserBaseId;
								$.alert(res.message, '提示', function() {
									_this.removeClass('ing').addClass('next').val('立即验证');
									mobileBox.find('li').addClass('fn-hide');
									mobileBox.find('li.newcode').removeClass('fn-hide');
								});
							} else {
								$.alert(res.message, '提示');
								_this.removeClass('ing');
							}
						}
					});
				}
			} else {
				//未绑定
				site.ajax({
					url: '/app/bondingMobileSub.htm?code=' + mobileBox.find('#code').val(),
					success: function(res) {
						if (res.code === 1) {
							$.alert('成功绑定~', '提示', function() {
								window.location.href = '/mobile/set.html';
							});
						} else {
							$.alert(res.message, '提示');
							_this.removeClass('ing');
						}
					}
				});
			}
		} else {
			$.alert('请先获取手机验证码', '提示');
		}
	});
});