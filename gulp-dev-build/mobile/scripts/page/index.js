/*
 *首页
 *updata 2015.08.25 sanmiao
 */
define(function(require, exports, module) {
	var site = require('config')('index', null);
	$.showPreloader();

	function num2double(num) {
		if (num < 10) {
			return ('0' + num);
		}
		return num;
	}
	//渲染首页轮播图
	function readerBanner(res) {
		if (res.code === 1) {
			$('#slide').html(template('t-slide', res)).swipeSlide({
				continuousScroll: true,
				speed: 3000,
				transitionType: 'cubic-bezier(0.22, 0.69, 0.72, 0.88)',
				firstCallback: function(i, sum, me) {
					me.find('.dot').children().first().addClass('cur');
				},
				callback: function(i, sum, me) {
					me.find('.dot').children().eq(i).addClass('cur').siblings().removeClass('cur');
				}
			});
		} else {
			document.getElementById('slide').className += ' fn-hide';
		}
		getIndexItem();
	}
	//获取首页标
	function getIndexItem() {
		//获取第一个标
		site.ajax({
			url: '/app/appProjectList.htm?pageNumber=1&pageSize=1',
			success: function(res) {
				$.hidePreloader();
				if (res.code === 1) {
					if (!res.list.length) {
						return;
					}
					var ITEM = res.list[0];
					document.getElementById('push').innerHTML = template('t-push', ITEM);
					document.getElementById('bar').style.width = ITEM.investProgress + '%';
					var timerDOM = document.getElementById('timer');
					var timerT = '';
					if (ITEM.status === '1') {
						timerT = '距离结束时间：';
					} else if (ITEM.status === '3') {
						timerT = '距离起投时间：';
					}
					var leftTime = parseInt(ITEM.leftTime, 10);
					window.timer = setInterval(function() {
						if (leftTime == 0) {
							return;
						} else if (leftTime > 0) {
							var _D = Math.floor(leftTime / 86400);
							var _H = num2double(Math.floor((leftTime % 86400) / 3600));
							var _M = num2double(Math.floor(((leftTime % 86400) % 3600) / 60));
							var _S = num2double(Math.floor(((leftTime % 86400) % 3600) % 60));
							timerDOM.innerHTML = timerT + '<strong>' + _D + '</strong>天<strong>' + _H + '</strong>时<strong>' + _M + '</strong>分<strong>' + _S + '</strong>秒';
							leftTime--;
						} else {
							window.location.reload(true);
							return;
						}
					}, 1000);
				}
			}
		});
	}
	var getIndexImg = {};
	if ((parseInt(site.getSession('getIndexImg').firstTime, 10) - site.cacheTime) < (new Date()).getTime()) {
		getIndexImg = site.getSession('getIndexImg');
	}
	if (getIndexImg.imgInfo && getIndexImg.refreshTime < 3) {
		++getIndexImg.refreshTime;
		readerBanner(getIndexImg);
		site.setSession('getIndexImg', getIndexImg);
	} else {
		site.ajax({
			url: '/app/getIndexImg.htm',
			success: function(res) {
				res.refreshTime = 1;
				res.firstTime = (new Date()).getTime();
				site.setSession('getIndexImg', res);
				readerBanner(res);
			}
		});
	}
});