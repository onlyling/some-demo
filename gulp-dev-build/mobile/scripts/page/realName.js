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
	//是否配置弱实名 site.config.hasWeakness
	var status = site.config.hasWeakness ? '' : 'zj', //仅仅是选择模板，与输入或阅读状态无关
		certifyLevel = 0, //实名登记
		realCertNo, //缓存证件号码
		isCerNo = false, //证件号码是否可用
		realNameInfo, //缓存用户信息
		realName = $('#realName');
	if (site.getParam('status')) {
		status = site.getParam('status');
	}
	//开通第三方账户只能强实名
	//缓存对象
	var appAccountInfo = {};
	//session中是否有缓存对象，缓存是否过期
	site.ajax({
		url: '/app/appAccountInfo.htm',
		async: false,
		success: function(res) {
			if (res.code === 1) {
				appAccountInfo = res;
			}
		}
	});
	if (!appAccountInfo.activeYjfPwdUrl && !status) {
		status = 'zj';
	}
	$.showPreloader();

	site.ajax({
		url: '/app/getRealNameInfo.htm',
		success: function(res) {
			$.hidePreloader();
			if (res.code === 1) {
				realNameInfo = res.realNameInfo;

				realNameInfo.status = status;
				realCertNo = realNameInfo.realCertNo;
				if (realNameInfo.certifyLevel === '1') {
					isCerNo = true;
				}
				certifyLevel = realNameInfo.certifyLevel;
				switch (realNameInfo.realNameAuthentication) {
					case 'N': //从未实名
						document.getElementById('realName').innerHTML = template('t-input', realNameInfo);
						break;
					case 'IS': //实名通过
					case 'IN': //申请中
					case 'NO': //未通过
						var tplID = 't-read';
						if (site.getParam('status')) {
							tplID = 't-input';
						}
						document.getElementById('realName').innerHTML = template(tplID, realNameInfo);
						break;
				}
				if (status) {
					require('upfile');
					$("#businessPeriod").calendar({
						value: ['2020-12-12']
					});
				}
			} else {
				$.alert(res.message, '提示', function() {
					window.location.href = '/mobile/login.html';
				});
			}
		}
	});
	realName.on('change', '#certNo', function() {
		this.value = this.value.toUpperCase();
		var _thisVal = this.value;
		if (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(_thisVal)) {
			//验证唯一性
			if (site.config.IDCardIsSole) {
				site.ajax({
					url: '/app/verifyCertNo.htm?certNo=' + _thisVal,
					success: function(res) {
						if (res.code === 1) {
							isCerNo = true;
						} else {
							$.alert(res.message);
							isCerNo = false;
						}
					}
				});
			} else {
				isCerNo = true;
			}
		} else {
			$.alert('请输入正确的证件号码', '提示');
		}
	}).on('click', 'input.button', function() {
		var _this = $(this);
		setTimeout(function() {
			if (!isCerNo) {
				$.alert('请输入有效证件号码', '提示');
				return;
			}
			if (_this.hasClass('ing')) {
				return;
			}
			_this.addClass('ing');
			if (_this.hasClass('kj')) {
				var rObj = {
					realName: document.getElementById('userName').value,
					certNo: document.getElementById('certNo').value
				};
				if (rObj.realName && rObj.certNo) {
					site.ajax({
						url: '/app/quickCertify.htm',
						data: rObj,
						success: function(res) {
							if (res.code === 1) {
								$.alert('已提交实名', '提示', function() {
									window.location.href = '/mobile/set.html';
								});
							} else {
								$.alert(res.message, '提示');
								_this.removeClass('ing');
							}
						}
					});
				} else {
					$.alert('请输入完整信息', '提示');
					_this.removeClass('ing');
				}
			} else {
				var rObj = {
					realName: document.getElementById('userName').value,
					certNo: realCertNo,
					businessPeriod: document.getElementById('businessPeriod').value,
					certFrontPath: document.getElementById('certFrontPath').value,
					certBackPath: document.getElementById('certBackPath').value
				};
				if (realNameInfo.certifyLevel === '0') {
					rObj.certNo = document.getElementById('certNo').value;
				}
				if (rObj.realName && rObj.certNo && rObj.businessPeriod && rObj.certFrontPath && rObj.certBackPath) {
					site.ajax({
						url: '/app/realNameAuthentication.htm',
						data: rObj,
						success: function(res) {
							if (res.code === 1) {
								$.alert('已提交实名', '提示', function() {
									window.location.href = '/mobile/set.html';
								});
							} else {
								$.alert(res.message, '提示');
								_this.removeClass('ing');
							}
						}
					});
				} else {
					$.alert('请输入完整信息', '提示');
					_this.removeClass('ing');
				}
			}
		}, 1000);
	});
});