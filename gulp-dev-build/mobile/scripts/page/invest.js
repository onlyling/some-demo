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
	var demandId = site.getParam('demandId'),
		tradeId = site.getParam('tradeId'),
		loanPurpose, //借款用途
		appInvestDetail, //投资明细
		loanerInfo, //借款详情
		promiseInfo, //承诺信息
		investDetail, //投资明细
		statusCode, //状态 1:正在投资2：投资已满 3：未到时间 4：交易完成 5:等待还款 6.已过投资时间 7：项目成立，起息日 8:交易失败 9：提前还款
		statusName = '未初始化', //状态名称
		canUseCoupon = false, //是否可以使用优惠券（红包、加息券、体验金）
		canInvest = true, //是否可以投资，防止余额不足
		leastInvestAmount, //起投金额
		increaseAmount, //递增金额
		inputMoney, //投资金额，第一次等于起投金
		yjfPaypassUrl, //易极付支付密码
		availableBalance, //账户余额
		avalableAmount; //剩余金额
	var invest = $('#invest'); //整个投资详情
	var popupBox = $('#popupBox'); //弹窗内容区域
	var investBtn = $('#investBtn'); //投资按钮
	var investsBox = $('#investsBox'); //我要投资区域
	//支付密码正确后必须的几个数据
	var appInvest = {
		demandId: demandId,
		tradeId: tradeId
	}; //最后提交数据
	window.payPassOk = function(paytk) {
		appInvest.paytk = paytk;
		$.showPreloader();
		$.ajax({
			url: '/app/appInvest.htm',
			data: appInvest,
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
	template.helper('getJG', function(objT, objL) {
		var _arr = [];
		for (var x in objT) {
			if ((/^infos/g).test(x)) {
				if (objL[x] && objL[x] !== ' ') {
					_arr.push({
						title: objT[x],
						infos: objL[x]
					});
				}
			}
		}
		return template('t-JG', {
			list: _arr
		});
	});
	//getNum 转换为数字
	function getNum(str) {
		return parseFloat(('' + str).replace(/\,/g, ''));
	}
	//点击出现弹窗
	function showPopup(ctt) {
		popupBox.html(ctt);
		$.popup('.popup-invest');
	}
	//获取项目详情
	site.ajax({
		url: '/app/appProjectDetail.htm?demandId=' + demandId,
		success: function(res) {
			$.hidePreloader();
			if (res.code === 1) {
				var ITEM = res.ProjectDetail[0];
				if (ITEM.useGiftMoney === 'Y' || ITEM.useGainMoney === 'Y' || ITEM.useExperienceAmount === 'Y') {
					canUseCoupon = true;
				}
				leastInvestAmount = inputMoney = getNum(ITEM.leastInvestAmount); //起投金额
				loanPurpose = ITEM.loanPurpose; //借款用途
				statusCode = ITEM.status; //状态
				//如果已结束，实际状态覆盖计划状态
				if (statusCode != '1' && statusCode != '3') {
					ITEM.loanAmount = ITEM.loanedAmount;
					ITEM.investProgress = '100.0';
					ITEM.avalableAmount = '0';
				}
				document.getElementById('invest').innerHTML = template('t-invest', ITEM);
				//获取状态名称
				switch (statusCode) {
					case '1':
						statusName = '正在投资';
						break;
					case '2':
						statusName = '投资已满';
						break;
					case '3':
						statusName = '未到时间';
						break;
					case '4':
						statusName = '交易完成';
						break;
					case '5':
						statusName = '等待还款';
						break;
					case '6':
						statusName = '已过投资时间';
						break;
					case '7':
						statusName = '项目成立，起息日';
						break;
					case '8':
						statusName = '交易失败';
						break;
					case '9':
						statusName = '提前还款';
						break;
				}
				//改变投资按钮状态
				if (statusCode !== '1') {
					investBtn.text(statusName).removeClass('button-danger').addClass('button-warning');
				}
			} else {
				$.alert('服务器繁忙，请稍后再试~');
			}
		}
	});
	//查看详情 事件委托
	invest.on('click', '.loanerInfo', function() {
		//点击查看借款详情
		if (!loanerInfo) {
			$.showIndicator();
			site.ajax({
				url: '/app/loanerInfo.htm?demandId=' + demandId,
				success: function(res) {
					$.hideIndicator();
					loanerInfo = template('t-loanerInfo', res);
					popupBox.html(loanerInfo);
					$.popup('.popup-invest');
				}
			});
		} else {
			showPopup(loanerInfo);
		}
	}).on('click', '.promiseInfo', function() {
		//点击查看承诺详情
		if (!promiseInfo) {
			$.showIndicator();
			site.ajax({
				url: '/app/getPromiseInfo.htm?demandId=' + demandId,
				success: function(res) {
					$.hideIndicator();
					promiseInfo = template('t-promiseInfo', res);
					popupBox.html(promiseInfo);
					$.popup('.popup-invest');
				}
			});
		} else {
			showPopup(promiseInfo);
		}
	}).on('click', '.investDetail', function() {
		//点击查看投资明细
		if (!investDetail) {
			$.showIndicator();
			site.ajax({
				url: '/app/appInvestDetail.htm?pageNumber=1&pageSize=99&tradeId=' + tradeId,
				success: function(res) {
					$.hideIndicator();
					investDetail = template('t-investDetail', res);
					popupBox.html(investDetail);
					$.popup('.popup-invest');
				}
			});
		} else {
			showPopup(investDetail);
		}
	}).on('click', '.loanPurpose', function() {
		//点击查看投资明细
		showPopup(loanPurpose);
	});
	//立即投资
	investBtn.on('click', function() {
		if (statusCode !== '1') {
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
		setTimeout(function() {
			$.hideIndicator();
		}, 1000);
		hasRA(site, function() {
			//获取项目投资数据
			site.ajax({
				url: '/app/gotoInvest.htm?demandId=' + demandId,
				success: function(res) {
					yjfPaypassUrl = res.yjfPaypassUrl;
					avalableAmount = getNum(res.getInvestInfo.avalableAmount); //剩余金额
					appInvest.token = res.getInvestInfo.token; //支付密码正确后必须的几个数据
					availableBalance = getNum(res.getInvestInfo.availableBalance); //账户余额
					increaseAmount = getNum(res.getInvestInfo.increaseAmount); //递增金额
					//剩余金额小于起投金额
					if (avalableAmount <= leastInvestAmount) {
						leastInvestAmount = avalableAmount;
					}
					//余额是否达到起投
					if (availableBalance < leastInvestAmount) {
						$.confirm('账户余额小于起投金额，是否去充值？', function() {
							window.location.href = '/mobile/recharge.html';
						});
						return;
					}
					investsBox.html(template('t-investsBox', {
						leastInvestAmount: leastInvestAmount,
						increaseAmount: increaseAmount,
						avalableAmount: avalableAmount,
						availableBalance: availableBalance
					}));
					$.popup('.popup-invests');
				}
			});
		});
	});
	//jsq方法
	function jsqAddSub(s) {
		var _input = investsBox.find('#inputMoney');
		var _scale = increaseAmount ? increaseAmount : 1;
		var _x = getNum(_input.val());
		switch (s) {
			case '-':
				_x -= _scale;
				break;
			case '+':
				_x += _scale;
				break;
		}
		_input.val(_x).trigger('change');
	}
	//显示支付密码框
	function showYJFPWD() {
		$.closeModal('.popup-invests');
		document.getElementById('popupBox').innerHTML = '<iframe src="' + yjfPaypassUrl + '" frameborder="0" width="100%" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>';
		$.popup('.popup-invest');
	}
	//我要投资
	investsBox.on('change', '#inputMoney', function() {
		//投资金额变化
		var _this = $(this),
			_thisVal = getNum(_this.val()),
			_min = leastInvestAmount,
			_max = (avalableAmount <= availableBalance) ? avalableAmount : availableBalance;
		if (_thisVal < _min) {
			_this.val(_min);
		}
		if (_thisVal > _max) {
			_this.val(_max);
		}
		inputMoney = _this.val();
	}).on('click', '#btnSub', function() {
		jsqAddSub('-');
	}).on('click', '#btnAdd', function() {
		jsqAddSub('+');
	}).on('click', '#investsBtn', function() {
		var _this = $(this);
		if (_this.hasClass('ing')) {
			return;
		}
		_this.addClass('ing');
		appInvest.amount = inputMoney; //支付密码正确后必须的几个数据
		//canUseCoupon 是否可用其他优惠
		if (canUseCoupon) {
			if (_this.hasClass('hasPrivilege')) {
				showYJFPWD();
			} else {
				//查询是否有可用
				site.ajax({
					url: '/app/queryUserGiftMoney.htm?demandId=' + demandId + '&investAmount=' + inputMoney,
					success: function(res) {
						if (res.code === 1) {
							if (!res.giftMoney && !res.experienceLimitAmount && !res.gainList.length) {
								//无可用优惠
								showYJFPWD();
							} else {
								//红包
								if (res.giftMoney) {
									investsBox.find('li.useGiftMoney').removeClass('fn-hide').find('input').attr('placeholder', '最多可用' + (res.giftMoneyLimitAmount?((res.giftMoney <= res.giftMoneyLimitAmount) ? res.giftMoney : res.giftMoneyLimitAmount):res.giftMoney) + '元');
								}
								//体验金
								if (res.experienceLimitAmount) {
									investsBox.find('li.useExperienceAmount').removeClass('fn-hide').find('input').attr('placeholder', '最多可用' + ((res.experienceAmount <= res.experienceLimitAmount) ? res.experienceAmount : res.experienceLimitAmount) + '元');
								}
								//加息券
								if (res.gainCanUse.length > 0) {
									investsBox.find('li.useGainMoney').removeClass('fn-hide').find('input').attr('placeholder', '最高可用' + res.gainCanUse + '%');
									//picker数据
									var _dataList = [];
									for (var i = res.gainList.length - 1; i >= 0; i--) {
										_dataList.push('加息' + res.gainList[i].rateOfYear + '%(' + res.gainList[i].giftTradeId + ')');
									}
									investsBox.find('#gainMoneyTradeIds').picker({
										toolbarTemplate: ['<header class="bar bar-nav">',
											'<button class="button button-link pull-right close-picker">确定</button>',
											'<h1 class="title">最高可用' + res.gainCanUse + '%</h1>',
											'</header>'
										].join(''),
										cols: [{
											textAlign: 'center',
											values: _dataList
										}]
									});
								}
								//加息券
								//显示界面
								investsBox.find('ul.hasPrivilege').removeClass('fn-hide');
								_this.addClass('hasPrivilege').removeClass('ing');
							}
						} else {
							showYJFPWD();
						}
					}
				});
			}
		} else {
			showYJFPWD();
		}
	}).on('change', '#giftMoney', function() {
		//红包
		appInvest.giftMoney = this.value; //支付密码正确后必须的几个数据
	}).on('change', '#experienceAmount', function() {
		//体验金
		appInvest.experienceAmount = this.value; //支付密码正确后必须的几个数据
	}).on('change', '#gainMoneyTradeIds', function() {
		//加息券ID
		var gainID = bank.find('#singBankList').val();
		var gainIDArr = gainID.split('(');
		if (gainIDArr.length <= 1) {
			return;
		}
		appInvest.gainMoneyTradeIds = gainIDArr[1].substr(0, (gainIDArr[1].length - 1)); //支付密码正确后必须的几个数据
	});
});