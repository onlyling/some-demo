/*
 *首页
 *updata 2015.08.25 sanmiao
 */
define(function(require, exports, module) {
	var site = require('config')('more', null);
	if (!site.config.hasMore) {
		window.location.href = '/mobile/index.html';
		return;
	}
	$.showPreloader();
	setTimeout(function() {
		$.hidePreloader();
	}, 600);
	var pageAbout = '', //关于我们
		pageHelp = '', //帮助中心
		pageNews = ''; //新闻列表
	var moreList = $('#moreList');
	var popupBox = $('#popupBox'); //弹出层内容框

	//点击出现弹窗
	function showPopup(ctt) {
		popupBox.html(ctt);
		$.popup('.popup-more');
	}
	//客服号码
	moreList.find('a.tel').attr('href', 'tel:' + site.config.tel);
	//查看详情
	moreList.on('click', '.about', function() {
		//点击查看 关于我们
		if (!pageAbout) {
			site.ajax({
				url: '/app/aboutUs.htm',
				success: function(res) {
					pageAbout = template('t-about', res);
					popupBox.html(pageAbout);
					$.popup('.popup-more');
				}
			});
		} else {
			showPopup(pageAbout);
		}
	}).on('click', '.help', function() {
		//点击查看 帮助中心
		if (!pageHelp) {
			site.ajax({
				url: '/app/HelpContents.htm',
				success: function(res) {
					pageHelp = template('t-help', res);
					popupBox.html(pageHelp);
					$.popup('.popup-more');
				}
			});
		} else {
			showPopup(pageHelp);
		}
	}).on('click', '.news', function() {
		//点击查看 帮助中心
		if (!pageNews) {
			site.ajax({
				url: '/app/getNewsList.htm',
				success: function(res) {
					pageNews = template('t-news', res);
					popupBox.html(pageNews);
					$.popup('.popup-more');
				}
			});
		} else {
			showPopup(pageNews);
		}
	});
	//列表
	popupBox.on('click', '.card-header', function() {
		$(this).next().toggleClass('fn-hide');
	});
});