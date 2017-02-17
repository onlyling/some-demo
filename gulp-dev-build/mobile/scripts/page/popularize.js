/*
 *用户中心
 *引用 require('config')('user', '用户中心');
 *必须操作
 *
 *updata 2015.08.25 sanmiao
 */
define(function(require, exports, module) {
	var site = require('config')('user', '推广二维码');
	if (!site.userInfo.isLogin) {
		window.location.href = '/mobile/login.html';
	}
	var popularize = $('#popularize');
	var activeAccount;
	if (site.getSession('activeAccount').code) {
		activeAccount = site.getSession('activeAccount');
	} else {
		site.ajax({
			url: '/app/appMeAccount.htm',
			async: false,
			success: function(res) {
				site.setSession('activeAccount', res);
				activeAccount = res;
			}
		});
	}
	//粘贴板
	var popularizeCopy = new Clipboard('#popularizeCopy');
	popularizeCopy.on('success', function(e) {
		$.alert('复制到粘贴板，可以分享给小伙伴了~', '提示');
	}).on('error', function(e) {
		$.alert('复制失败，请使用二维码~', '提示');
	});
	popularize.find('#popularizeUrl').text(activeAccount.openInvestorUrl);
	popularize.find('#popularizeID').text(activeAccount.openInvestorUrl.split('=')[1]);
	//二维码
	var qrcode = new QRCode('qrcode', {
		width: 200,
		height: 200,
		colorDark: '#123'
	});
	qrcode.makeCode(activeAccount.openInvestorUrl);
});