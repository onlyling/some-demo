/*
 *用户中心
 *引用 require('config')('user', '经纪人收益');
 *必须操作
 *
 *updata 2015.08.25 sanmiao
 */
define(function(require, exports, module) {
	var site = require('config')('user', '经纪人收益');
	if (!site.userInfo.isLogin) {
		window.location.href = '/mobile/login.html';
	}
	//获取状态
	var list = $('#list'),
		moreBtn = $('#moreBtn'),
		pageNumber = 1, //当前第x页
		totalPage = 2; //总页
	//获取数据
	function getDate(pageNumber) {
		$.showPreloader();
		site.ajax({
			url: '/app/appBusinessManager.htm',
			data: {
				pageNumber: pageNumber,
				pageSize: 4
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
						list.html(template('t-list', res));
					} else {
						list.append(template('t-list', res));
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
		getDate(++pageNumber);
	});
	getDate(pageNumber);
});