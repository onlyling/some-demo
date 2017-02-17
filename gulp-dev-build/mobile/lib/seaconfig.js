~ function() {
	var dir = seajs.data ? seajs.data.base : seajs.pluginSDK.util.loaderDir;
	var host = dir.match(/(http|https):\/\/.+?\//)[0];
	var base = host + 'mobile/scripts/';
	seajs.config({
		base: base,
		debug: true,
		alias: {
			//公共文件
			'config': 'common/config.js',
			'upfile': 'common/upfile.js',
			'hasRA': 'common/hasRA.js',
			'method': 'common/method.js',
			//页面用到的文件
			'pageIndex': 'page/index.js',
			'pageInvests': 'page/invests.js',
			'pageInvest': 'page/invest.js',
			'pageTransfers': 'page/transfers.js',
			'pageTransfer': 'page/transfer.js',
			'pageMore': 'page/more.js',
			'pageLogin': 'page/login.js',
			'pageForget': 'page/forget.js',
			'pageRegister': 'page/register.js',
			'pageUser': 'page/user.js',
			'pageCoupon': 'page/coupon.js',
			'pageInvesteds': 'page/investeds.js',
			'pageInvested': 'page/invested.js',
			'pageTransfereds': 'page/transfereds.js',
			'pageTotransfered': 'page/totransfered.js',
			'pageQueryList': 'page/queryList.js',
			'pageCollection': 'page/collection.js',
			'pageSet': 'page/set.js',
			'pageMobile': 'page/mobile.js',
			'pageEmail': 'page/email.js',
			'pagePassword': 'page/password.js',
			'pageRealName': 'page/realName.js',
			'pageRecharge': 'page/recharge.js',
			'pageWithdraw': 'page/withdraw.js',
			'pagePopularize': 'page/popularize.js',
			'pageAgentEarningse': 'page/agentEarnings.js',
			'pageCustomerManager': 'page/customerManager.js',
			'pageCustomerBaseInfo': 'page/customerBaseInfo.js',
			'pageInvestorOpenAccount': 'page/investorOpenAccount.js',
			'useCommon': 'page/common.js'
		}
	});
}();