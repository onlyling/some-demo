/*
 *投资列表页
 *引用 require('config')('invest', '投资列表');
 *必须操作
 *
 *updata 2015.08.25 sanmiao
 */
define(function(require, exports, module) {
	var site = require('config')('invest', '投资列表');
	var pageNumber = 1;
	var moreBtn = $('#moreBtn');
	var invests = $('#invests');
	//是否开启债权转让
	if (site.config.transfer) {
		$('#isTransfer').removeClass('fn-hide');
	} else {
		window.location.href = '/mobile/invests.html';
	}
	//缓存数据 根据firstTime判断是否过期
	var transferSession = {};
	//查看session中是否有数据，数据是否过期
	if (((new Date()).getTime() - parseInt(site.getSession('transferSession').firstTime, 10)) < site.cacheTime) {
		transferSession = site.getSession('transferSession');
	} else {
		transferSession = {
			firstTime: (new Date()).getTime(), //当前时间
			list: [], //缓存数据列表，二维数组
			pageNumber: 1, //初次第几页
			totalPage: 1, //总共多少页
			refreshTime: 1 //当前数据刷新次数
		};
	}
	/*
	 * 通过ajax或从session缓存中获取数据
	 * 并把数据追加到@param{DOM}的内部末尾
	 * @method getData
	 * @for 所属类名
	 * @param {number} 当前页数
	 * @param {DOM} jQuery/zepto对象，需要被填充的DOM
	 * @param {string} template模板ID
	 * @param {function} 成功后添加后的回调函数
	 */
	function getData(pageNumber, invests, templateID, fn) {
		//提示框
		$.showPreloader();
		//先从缓存中获取数据
		//session 数据需大于一页，且大于当前页，刷新次数少于3
		if (transferSession.pageNumber > 1 && transferSession.pageNumber > pageNumber && transferSession.refreshTime < 3) {
			var res = {
				list: transferSession.list[(pageNumber - 1)]
			};
			invests.append(template(templateID, res));
			moreBtn.removeClass('fn-hide');
			if (fn) {
				fn(res);
			}
			$.hidePreloader();
			//从session中拿数据，刷新次数
			transferSession.refreshTime += 1;
			site.setSession('transferSession', transferSession);
		} else {
			site.ajax({
				url: '/app/transfersProjectList.htm',
				data: {
					pageNumber: pageNumber,
					status: 3,
					pageSize: 5
				},
				success: function(res) {
					if (res.code === 1) {
						invests.append(template(templateID, res));
						moreBtn.removeClass('fn-hide');
						if (fn) {
							fn(res);
						}
						$.hidePreloader();
						if (pageNumber >= res.totalPage) {
							moreBtn.addClass('ing').text('没有更多了');
						}
						//缓存数据
						transferSession.list.push(res.list);
						transferSession.pageNumber = pageNumber;
						transferSession.totalPage = res.totalPage;
						transferSession.refreshTime = 1;
						site.setSession('transferSession', transferSession);
					}
				}
			});
		}
	}
	//第一个获取数据
	getData(pageNumber, invests, 't-invests');
	//获取更多
	moreBtn.on('click', function() {
		var _this = $(this);
		if (_this.hasClass('ing')) {
			return;
		}
		_this.addClass('ing');
		getData(++pageNumber, invests, 't-invests', function(res) {
			_this.removeClass('ing');
		});
	});
});