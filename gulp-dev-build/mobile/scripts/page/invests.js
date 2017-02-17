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
	}
	//模板方法
	template.helper('getStatus', function(s) {
		var _s;
		switch (s) {
			case '1':
				_s = '立即投资';
				break;
			case '2':
				_s = '投资已满';
				break;
			case '3':
				_s = '未到时间';
				break;
			case '4':
				_s = '交易完成';
				break;
			case '5':
				_s = '等待还款';
				break;
			case '6':
				_s = '已过投资时间';
				break;
			case '7':
				_s = '项目成立';
				break;
			case '8':
				_s = '交易失败';
				break;
			case '9':
				_s = '提前还款';
				break;
		}
		return _s;
	});
	//缓存数据 根据firstTime判断是否过期
	var investSession = {};
	//查看session中是否有数据，数据是否过期
	//
	if (((new Date()).getTime() - parseInt(site.getSession('investSession').firstTime, 10)) < site.cacheTime) {
		investSession = site.getSession('investSession');
	} else {
		investSession = {
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
		var isUserSession = false;
		//提示框
		$.showPreloader();
		//先从缓存中获取数据
		//session 数据需大于一页，且大于当前页，刷新次数少于3
		if (investSession.pageNumber > 1 && investSession.pageNumber >= pageNumber && investSession.refreshTime < 3) {
			isUserSession = true;
			var res = {
				list: investSession.list[(pageNumber - 1)]
			};
			invests.append(template(templateID, res));
			moreBtn.removeClass('fn-hide');
			if (fn) {
				fn(res, isUserSession);
			}
			$.hidePreloader();
			site.setSession('investSession', investSession);
		} else {
			site.ajax({
				url: '/app/appProjectList.htm',
				data: {
					pageNumber: pageNumber,
					pageSize: 5
				},
				success: function(res) {
					isUserSession = false;
					if (res.code === 1) {
						invests.append(template(templateID, res));
						moreBtn.removeClass('fn-hide');
						if (fn) {
							fn(res, isUserSession);
						}
						$.hidePreloader();
						if (pageNumber >= res.totalPage) {
							moreBtn.addClass('ing').text('没有更多了');
						}
						//缓存数据
						investSession.list.push(res.list);
						investSession.pageNumber = pageNumber;
						investSession.totalPage = res.totalPage;
						investSession.refreshTime = 1;
						site.setSession('investSession', investSession);
					}
				}
			});
		}
	}
	//第一个获取数据
	getData(pageNumber, invests, 't-invests', function(res, isUserSession) {
		if (isUserSession) {
			//从session中拿数据，刷新次数
			investSession.refreshTime += 1;
		}
	});
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