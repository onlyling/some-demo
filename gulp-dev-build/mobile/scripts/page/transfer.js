/*
 *require('config') 必须引用，全局配置、公共方法等
 *require('hasRA') 投资前需验证内容
 *活动变量 用于缓存ajax请求获得的数据，避免多次点击反复发起请求
 *如果已结束，实际状态覆盖计划状态
 *updata 2016.01.06 sanmiao
 */
define(function(require, exports, module) {
	var site = require('config')('invest', '投资项目');
	var hasRA = require('hasRA'); //是否实名认证、是否开通第三方账户
	$.showPreloader();
	//活动变量
	var tradeDetailId = site.getParam('tradeDetailId'),
		tradeTransferId, //投资关联id
		statusName, //状态
		yjfPaypassUrl; //易极付支付密码
	var invest = $('#invest'); //整个投资详情
	var popupBox = $('#popupBox'); //弹窗内容区域
	var investBtn = $('#investBtn'); //投资按钮
	var investsBox = $('#investsBox'); //我要投资区域
	//支付密码正确后必须的几个数据
	var transfersInvestSub = {}; //最后提交数据
	window.payPassOk = function(paytk) {
		transfersInvestSub.paytk = paytk;
		$.showPreloader();
		$.ajax({
			url: '/app/transfersInvestSub.htm',
			data: transfersInvestSub,
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
	//getNum 转换为数字
	function getNum(str) {
		return parseFloat(('' + str).replace(/\,/g, ''));
	}
	//获取项目详情
	site.ajax({
		url: '/app/transfersProjectList.htm?tradeDetailId=' + tradeDetailId,
		success: function(res) {
			$.hidePreloader();
			if (res.code === 1) {
				var ITEM = res.list[0];
				document.getElementById('invest').innerHTML = template('t-invest', ITEM);
				transfersInvestSub.tradeTransferId = tradeTransferId = ITEM.tradeTransferId;
				statusName = ITEM.status;
				//改变投资按钮状态
				if (statusName !== '转让中') {
					investBtn.text(statusName).removeClass('button-danger').addClass('button-warning');
				}
			} else {
				$.alert('服务器繁忙，请稍后再试~');
			}
		}
	});
	//立即购买
	investBtn.on('click', function() {
		if (statusName !== '转让中') {
			$.alert(statusName, '提示');
			return;
		}
		if (!site.userInfo.isLogin) {
			$.confirm('您还没登录，不能进行该操作，现在是否去登录？', function() {
				//缓存回调url
				site.setSession('beforeLogin', {
					url: window.location.href
				});
				window.location.href = '/mobile/login.html';
			});
			return;
		}
		//是否实名认证 开通第三方账户
		$.showIndicator();
		hasRA(site, function() {
			//获取项目投资数据
			site.ajax({
				url: '/app/preTransfersInvest.htm?tradeTransferId=' + tradeTransferId,
				success: function(res) {
					$.hideIndicator();
					yjfPaypassUrl = res.result.yjfPaypassUrl;
					transfersInvestSub.bizNo = res.result.bizNo;
					transfersInvestSub.token = res.result.token;
					var availableBalance = getNum(res.result.availableBalance);
					var needInvestAmout = getNum(res.result.needInvestAmout);
					if (availableBalance < needInvestAmout) {
						$.confirm('当前余额不能购买，是否去充值？', function() {
							window.location.href = '/mobile/recharge.html';
						});
						return;
					}
					showYJFPWD();
				}
			});
		});
	});
	//显示支付密码框
	function showYJFPWD() {
		$.closeModal('.popup-invests');
		document.getElementById('popupBox').innerHTML = '<iframe src="' + yjfPaypassUrl + '" frameborder="0" width="100%" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>';
		$.popup('.popup-invest');
	}
});