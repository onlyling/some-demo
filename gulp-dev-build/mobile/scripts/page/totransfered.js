/*
 *债权转让
 *updata 2015.08.25 sanmiao
 */
define(function(require, exports, module) {
	var site = require('config')('user', '债权转让');
	//用户登录
	if (!site.userInfo.isLogin) {
		window.location.href = '/mobile/login.html';
	}
	var tradeId = site.getParam('tradeId'),
		tradeDetailId = site.getParam('tradeDetailId'),
		deadline, //缓存截止时间
		step1 = $('#step1'),
		step2 = $('#step2'),
		yjfPaypassUrl, //易极付支付url
		//支付密码正确后必须的几个数据
		transferSubmit = {
			tradeDetailId: tradeDetailId
		};
	window.payPassOk = function(paytk) {
		transferSubmit.paytk = paytk;
		$.showPreloader();
		$.ajax({
			url: '/app/transferSubmit.htm',
			data: transferSubmit,
			dataType: 'json',
			type: 'POST',
			success: function(res) {
				$.hidePreloader();
				$.alert(res.message, '提示', function() {
					window.location.href = '/mobile/transfereds.html';
				});
			}
		});
	};
	$.showPreloader();
	//获取前置信息
	site.ajax({
		url: '/app/preTransfer.htm?tradeId=' + tradeId + '&tradeDetailId=' + tradeDetailId,
		success: function(res) {
			$.hidePreloader();
			if (res.code === 1) {
				yjfPaypassUrl = res.result.yjfPaypassUrl;
				deadline = res.result.deadline;
				step1.find('ul').html(template('t-step1', res.result));
			} else {
				$.alert(res.message, '提示');
			}
		}
	});
	step1.on('click', '#apply', function() {
		var amount = document.getElementById('amount').value;
		if (amount) {
			$.showIndicator();
			site.ajax({
				url: '/app/checktransferMoney.htm?&tradeDetailId=' + tradeDetailId + '&amount=' + amount,
				success: function(res) {
					$.hideIndicator();
					if (res.code === 1) {
						step2.find('ul').html(template('t-step2', {
							amount: amount,
							deadline: deadline,
							fee: res.fee,
							buyerDebtProfitRate: res.buyerDebtProfitRate
						}));
						transferSubmit.amount = amount;
						step1.addClass('fn-hide');
						step2.removeClass('fn-hide');
					} else {
						$.alert(res.message, '提示');
					}
				}
			});
		} else {
			$.alert('请输入转让价', '提示');
		}
	});
	step2.on('click', '#revamp', function() {
		step2.addClass('fn-hide');
		step1.removeClass('fn-hide');
	}).on('click', '#affirm', function() {
		document.getElementById('popupBox').innerHTML = '<iframe src="' + yjfPaypassUrl + '" frameborder="0" width="100%" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>';
		$.popup('.popup-totransfered');
	});
});