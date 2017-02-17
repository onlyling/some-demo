/*
 *债权转让
 *引用 require('config')('user', '债权转让');
 *必须操作
 *
 *updata 2015.08.25 sanmiao
 */
define(function(require, exports, module) {
	var site = require('config')('user', '债权转让');
	if (!site.userInfo.isLogin) {
		window.location.href = '/mobile/login.html';
	}
	//获取状态
	var status = site.getParam('status'), //状态
		nav = $('#nav'),
		list = $('#list'),
		moreBtn = $('#moreBtn'),
		url = '', //ajaxUrl
		pageNumber = 1, //当前第x页
		totalPage = 2; //总页
	if (status) {
		nav.find('a[alias="' + status + '"]').addClass('active');
	} else {
		status = nav.find('a').eq(0).addClass('active').attr('alias');
	}
	//状态转换
	switch (status) {
		case 'can':
			url = 'canTransList.htm?';
			break;
		case 'ing':
			url = 'transfersList.htm?status=2&';
			break;
		case 'end':
			url = 'transfersList.htm?status=1&';
			break;
		case 'false':
			url = 'transfersList.htm?status=0&';
			break;
		case 'buy':
			url = 'transfersList.htm?status=4&';
			break;
	}
	//获取数据
	function getDate(pageNumber, url, status) {
		$.showPreloader();
		site.ajax({
			url: '/app/' + url + 'pageSize=5&pageNumber=' + pageNumber,
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
		getDate(++pageNumber, url, status);
	});
	getDate(pageNumber, url, status);
	//撤销
	list.on('click', 'a.repeal', function() {
		var _this = $(this);
		if (_this.hasClass('ing')) {
			return;
		}
		_this.addClass('ing');
		$.confirm('确定撤销？', function() {
			$.showIndicator();
			site.ajax({
				url: '/app/cancelTransfer.htm?tradeId=' + _this.attr('tradeId') + '&tradeTransferId=' + _this.attr('tradeTransferId'),
				success: function(res) {
					$.hideIndicator();
					$.alert(res.message, '提示', function() {
						window.location.reload(true);
					});
				}
			});
		});
	});
});