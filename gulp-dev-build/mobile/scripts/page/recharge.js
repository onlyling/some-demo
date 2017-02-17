/*
 *首页
 *updata 2015.08.25 sanmiao
 */
define(function(require, exports, module) {
	var site = require('config')('user', '资金充值');
	if (!site.userInfo.isLogin) {
		window.location.href = '/mobile/login.html';
	}
	var singBankList, //银行列表
		isGetCode = false, //获取了验证码
		bankCode, //银行Code
		bankCardNo, //银行卡
		signBankInfos, //缓存已绑定信息
		yjfPaypassUrl, //缓存支付地址
		bank = $('#bank');
	dkChargeSubmit = {}; //全局对象
	//支付密码相关操作 全局变量
	window.payPassOk = function(paytk) {
		dkChargeSubmit.paytk = paytk;
		$.showPreloader();
		$.ajax({
			url: '/app/dkChargeSubmit.htm',
			data: dkChargeSubmit,
			dataType: 'json',
			type: 'POST',
			success: function(res) {
				$.hidePreloader();
				$.alert(res.message, '提示', function() {
					window.location.reload(true);
				});
			}
		});
	};
	$.showPreloader();
	//初始化页面
	site.ajax({
		url: '/app/dkCharge.htm',
		success: function(res) {
			$.hidePreloader();
			if (res.code === 1) {
				//是否绑卡
				if (!res.addCard) {
					//已绑卡
					dkChargeSubmit.token = res.token;
					signBankInfos = res.signBankInfos;
					yjfPaypassUrl = res.yjfPaypassUrl;
					bank.html(template('t-recharge', null));
					//银行卡
					var _signBankInfos = [];
					for (var i = 0; i < signBankInfos.length; i++) {
						_signBankInfos.push(signBankInfos[i].bankName + '(' + signBankInfos[i].thisCardLastNum + ')');
					}
					$('#bankCode').picker({
						toolbarTemplate: ['<header class="bar bar-nav">',
							'<button class="button button-link pull-right close-picker">确定</button>',
							'<h1 class="title">请选已绑定的银行卡</h1>',
							'</header>'
						].join(''),
						cols: [{
							textAlign: 'center',
							values: _signBankInfos
						}]
					}).val(_signBankInfos[0]);
					dkChargeSubmit.bankCode = signBankInfos[0].bankCode;
				} else {
					//未绑卡 获取银行卡
					$.showPreloader();
					if (site.getSession('singBankList').list) {
						singBankList = site.getSession('singBankList').list;
					} else {
						site.ajax({
							url: '/app/getAvalSinBank.htm',
							async: false,
							success: function(ress) {
								if (ress.code === 1) {
									site.setSession('singBankList', {
										list: ress.singBankList
									});
									singBankList = ress.singBankList;
								} else {
									$.alert('获取银行卡列表失败，请稍后重试~', '提示');
								}
							}
						});
					}
					$.hidePreloader();
					$('#uiHeader').find('h1').html('绑定银行卡');
					bank.html(template('t-bind', null));
					if (site.getSession('noCard').remind) {
						site.delSession('noCard');
					} else {
						$.alert('当前未绑定银行卡，请先绑定银行卡', '提示');
					}
					//银行卡
					var _singBankList = [];
					for (var i = 0; i < singBankList.length; i++) {
						_singBankList.push(singBankList[i].bankName + '(' + singBankList[i].bankCode + ')');
					}
					$('#singBankList').picker({
						toolbarTemplate: ['<header class="bar bar-nav">',
							'<button class="button button-link pull-right close-picker">确定</button>',
							'<h1 class="title">请选择支持的银行</h1>',
							'</header>'
						].join(''),
						cols: [{
							textAlign: 'center',
							values: _singBankList
						}]
					});
				}
			} else {
				$.alert(res.message, '提示', function() {
					window.location.href = '/mobile/set.html';
				});
			}
		}
	});
	bank.on('change', '#singBankList', function() {
		var bankCodes = bank.find('#singBankList').val();
		var bankCodesArr = bankCodes.split('(');
		if (bankCodesArr.length <= 1) {
			return;
		}
		bankCode = bankCodesArr[1].substr(0, (bankCodesArr[1].length - 1));
	}).on('change', '#bankCardNo', function() {
		bankCardNo = this.value;
	}).on('change', '#userPhoneNo', function() {
		userPhoneNo = this.value;
	}).on('click', '#getCode', function() {
		//是否有值
		if (bankCode && bankCardNo && userPhoneNo) {
			//检测手机号码格式
			if (!(/^1[3|4|5|8][0-9]\d{4,8}$/).test(userPhoneNo)) {
				$.alert('请输入正确的手机号码', '提示');
				return;
			}
			var _this = $(this);
			if (_this.hasClass('ing')) {
				return;
			}
			_this.addClass('ing');
			//检查卡号是否一致
			$.showPreloader('系统检测银行卡中..');
			site.ajax({
				url: '/app/checkBankCard.htm?bankCardNo=' + bankCardNo + '&bankCode=' + bankCode,
				success: function(res) {
					$.hidePreloader();
					if (res.code === 1) {
						//一致后发送验证短信
						site.ajax({
							url: '/app/singBank.htm?cardNo=' + bankCardNo + '&userPhoneNo=' + userPhoneNo,
							success: function(ress) {
								if (ress.code === 1) {
									$.alert('已发送验证码~', '提示');
									isGetCode = true;
									_this.val('30秒').removeClass('button-fill');
									setTimeout(function() {
										_this.addClass('button-fill').val('获取').removeClass('ing');
									}, 30000);
								} else {
									$.alert(ress.message, '提示');
									_this.removeClass('ing');
									isGetCode = false;
								}
							}
						});
					} else {
						$.alert(res.message, '提示');
						_this.removeClass('ing');
					}
				}
			});
		} else {
			$.alert('请填写完整信息', '提示');
		}
	}).on('click', '#bind', function() {
		if (isGetCode) {
			site.ajax({
				url: '/app/singBankCheck.htm?mobileCode=' + bank.find('#mobileCode').val(),
				success: function(res) {
					if (res.code === 1) {
						$.alert(res.message, '提示', function() {
							window.location.reload(true);
						});
					} else {
						$.alert(res.message, '提示');
					}
				}
			});
		} else {
			$.alert('请先获取短信', '提示');
		}
	}).on('change', '#bankCode', function() {
		var bankCode = this.value;
		var bankCodeArr = bankCode.split('(');
		if (bankCodeArr.length <= 1) {
			return;
		}
		for (var i = 0; i < signBankInfos.length; i++) {
			if (signBankInfos[i].bankName === bankCodeArr[0] && signBankInfos[i].thisCardLastNum === bankCodeArr[1].substr(0, (bankCodeArr[1].length - 1))) {
				dkChargeSubmit.bankCode = signBankInfos[i].bankCode;
			}
		}
	}).on('change', '#rechargeAmount', function() {
		dkChargeSubmit.rechargeAmount = this.value;
	}).on('click', '#recharge', function() {
		if (!dkChargeSubmit.bankCode || !dkChargeSubmit.rechargeAmount) {
			$.alert('请填写完整信息', '提示');
			return;
		}
		$('#popupBox').html('<iframe src="' + yjfPaypassUrl + '" frameborder="0" width="100%" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>');
		$.popup('.popup-password');
	});
});