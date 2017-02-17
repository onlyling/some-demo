/*
 *用户中心
 *引用 require('config')('user', '用户中心');
 *必须操作
 *
 *updata 2015.08.25 sanmiao
 */
define(function(require, exports, module) {
	var site = require('config')('user', '交易明细');
	if (!site.userInfo.isLogin) {
		window.location.href = '/mobile/login.html';
	}
	//获取状态
	var status = site.getParam('status'), //状态
		nav = $('#nav'),
		list = $('#list'),
		moreBtn = $('#moreBtn'),
		pageNumber = 1, //当前第x页
		totalPage = 2; //总页
	if (status) {
		nav.find('a[alias="' + status + '"]').addClass('active');
	} else {
		status = nav.find('a').eq(0).addClass('active').attr('alias');
	}
	//模板方法
	template.helper('getStatus', function(s) {
		var _s;
		switch (s) {
			case 'INITIAL':
				_s = '待处理';
				break;
			case 'SUBMIT_SETTLED':
				_s = '已报清算';
				break;
			case 'DEPOSITED':
				_s = '已充值';
				break;
			case 'SUCCESS':
				_s = '成功';
				break;
			case 'FAILURE':
				_s = '失败';
				break;
			case 'DEPOSIT_BACKED':
				_s = '已充退';
				break;
			case 'CHARGED':
				_s = '已收费';
				break;
			case 'PRE_SETTLED':
				_s = '已预清算';
				break;
			case 'CANCELED':
				_s = '已撤销';
				break;
		}
		return _s;
	});
	//获取数据
	function getDate(pageNumber, status) {
		$.showPreloader();
		site.ajax({
			url: '/app/' + status + '.htm',
			data: {
				pageNumber: pageNumber,
				pageSize: 10
			},
			success: function(res) {
				$.hidePreloader();
				if (res.code === 1) {
					totalPage = res.totalPage;
					if (pageNumber >= totalPage) {
						moreBtn.addClass('fn-hide');
					} else {
						moreBtn.removeClass('ing');
					}
					if (pageNumber === 1) {
						list.html(template('t-' + status, res));
					} else {
						list.append(template('t-' + status, res));
					}
				} else {
					$.alert('未能查找到~', '提示');
				}
			}
		});
	}
	moreBtn.on('click', function() {
		var _this = $(this);
		if (_this.hasClass('ing')) {
			return;
		}
		_this.addClass('ing');
		getDate(++pageNumber, status);
	});
	getDate(pageNumber, status);
});