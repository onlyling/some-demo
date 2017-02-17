/**
 * 是否实名认证、是否开通第三方账户
 *
 * /app/appMeAccount.htm 中的activeAccount已作废
 * 是否开通第三方账户，通过/app/appAccountInfo.htm的activeYjfPwdUrl
 */
define(function(require, exports, module) {
	'use strict';
	/**
	 * 是否实名认证、是否开通第三方账户
	 * @param  {[obj]}   site 站点配置对象
	 * @param  {Function} fn   验证过后的函数
	 */
	return function(site, fn) {
		//缓存对象
		var appAccountInfo = {};
		//session中是否有缓存对象，缓存是否过期
		//不能从session中读取缓存
		site.ajax({
			url: '/app/appAccountInfo.htm',
			async: false,
			success: function(res) {
				if (res.code === 1) {
					appAccountInfo = res;
				}
			}
		});
		//是否实名的实际操作
		function toRecharge(realNameInfo) {
			if (realNameInfo.certifyLevel === '0') {
				if (realNameInfo.realNameAuthentication === 'IN') {
					$.alert('实名认证中，暂不能进行该操作', '提示');
				} else {
					$.confirm('还未实名认证，现在去认证？', function() {
						window.location.href = '/mobile/realName.html';
					});
				}
			} else {
				fn();
			}
		}
		//是否开通第三方账户
		if (!appAccountInfo.activeYjfPwdUrl) {
			//是否有实名信息的缓存数据
			if (site.getSession('realNameInfo').certifyLevel) {
				toRecharge(site.getSession('realNameInfo'));
			} else {
				//是否实名
				site.ajax({
					url: '/app/getRealNameInfo.htm',
					success: function(res) {
						$.hidePreloader();
						if (res.code === 1) {
							var realNameInfo = res.realNameInfo;
							site.setSession('realNameInfo', realNameInfo);
							toRecharge(realNameInfo);
						} else {
							$.alert('获取信息失败，请刷新页面~', '提示');
						}
					}
				});
			}
		} else {
			$.confirm('还未开通第三方账户，现在去开通？', function() {
				window.location.href = appAccountInfo.activeYjfPwdUrl;
			});
		}
	};
});