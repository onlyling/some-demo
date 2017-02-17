/*
 *首页
 *updata 2015.08.25 sanmiao
 */
define(function(require, exports, module) {
	var site = require('config')('user', '资金提现');
	if (!site.userInfo.isLogin) {
		window.location.href = '/mobile/login.html';
	}
	var bankCode, //银行Code
		signBankInfos, //缓存已绑定信息
		yjfPaypassUrl, //缓存支付地址
		bank = $('#bank');
	WithrawByPtk = {}; //全局对象
	//支付密码后的操作
	window.payPassOk = function(paytk) {
		WithrawByPtk.paytk = paytk;
		$.showPreloader();
		$.ajax({
			url: '/app/WithrawByPtk.htm',
			data: WithrawByPtk,
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
	site.ajax({
		url: '/app/dkCharge.htm',
		success: function(res) {
			$.hidePreloader();
			if (res.code === 1) {
				//是否绑卡
				if (!res.addCard) {
					//已绑卡
					signBankInfos = res.signBankInfos;
					yjfPaypassUrl = res.yjfPaypassUrl;
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
					WithrawByPtk.bankCode = signBankInfos[0].bankCode;
				} else {
					$('#recharge').removeAttr('id');
					$.confirm('还未绑定银行卡，现在去绑定？', function() {
						site.setSession('noCard', {
							remind: 'Y'
						});
						window.location.href = '/mobile/recharge.html';
					});
				}
			} else {
				$.alert(res.message, '提示');
			}
		}
	});
	bank.on('change', '#bankCode', function() {
		var bankCode = this.value;
		var bankCodeArr = bankCode.split('(');
		if (bankCodeArr.length <= 1) {
			return;
		}
		for (var i = 0; i < signBankInfos.length; i++) {
			if (signBankInfos[i].bankName === bankCodeArr[0] && signBankInfos[i].thisCardLastNum === bankCodeArr[1].substr(0, (bankCodeArr[1].length - 1))) {
				WithrawByPtk.bankCode = signBankInfos[i].bankCode;
			}
		}
	}).on('change', '#money', function() {
		WithrawByPtk.money = this.value;
	}).on('click', '#recharge', function() {
		if (!WithrawByPtk.bankCode || !WithrawByPtk.money || !WithrawByPtk.delay) {
			$.alert('请填写完整信息', '提示');
			return;
		}
		$('#popupBox').html('<iframe src="' + yjfPaypassUrl + '" frameborder="0" width="100%" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>');
		$.popup('.popup-password');
	});
	//选择提现方式
	$("#wayList").on('change', 'input', function() {
		WithrawByPtk.delay = this.value;
	});
});