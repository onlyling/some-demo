var AppVue = Vue.extend({
	template: ['<div class="m-top">',
		'<a v-link="{path: \'home\'}">home</a>',
		'&emsp;',
		'<a v-link="{path: \'list\'}">list</a>',
		'</div>',
		// '<div>x</div><router-view transition="test"></router-view>',
		'<router-view></router-view>',
	].join('')
});

var AppHome = Vue.extend({
	template: '<div class="home">home</div>'
});

var AppList = Vue.extend({
	template: '<div class="m-scroll" v-scroll-bar="pageY"><div class="m-scroll-content"><div class="test-div" v-for="item in items">{{item}}</div></div></div>',
	data: function() {
		return {
			items: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'],
			pageY: 100
		}
	}
});

Vue.directive('scroll-bar', {
	bind: function() {
		console.log('bind');

		var self = this,
			selfEl = self.el;

		var _startY = 0,
			_pageY = 0,
			_startTime,
			_move = 0;

		// 绑定事件
		selfEl.addEventListener('touchstart', function(event) {

			event.preventDefault();

			// 重置一些静态数据，可能一些数据变化，造成一些差异
			self.maxBarTop = self.windowH - self.bar.offsetHeight;
			self.height = self.content.offsetHeight;
			self.maxPageH = self.height - self.windowH;

			// 更新缓存的_pageY
			_pageY = self.pageY;

			self.timer = function() {};

			// 显示滑块
			clearTimeout(self.hideBarTimer);
			self.bar.className = 'm-scroll-bar active';

			if (event.targetTouches.length == 1) {
				var _touch = event.targetTouches[0];
				// 记录起点
				_startY = _touch.pageY;
				// 记录开始时间
				_startTime = (new Date()).getTime();
				// 记录偏移量
				_move = 0;
			}

		}, false);

		selfEl.addEventListener('touchmove', function(event) {

			event.preventDefault();

			if (event.changedTouches.length == 1) {

				var _touch = event.changedTouches[0],
					_moveY = _touch.pageY - _startY; // 与起点的偏移量

				_move = Math.abs(_moveY);

				self.pageY = _pageY - _moveY;

				// 当self.pageY超过临界点，应该加一些阻力

				if (self.pageY < 0) {
					self.pageY = _pageY - _moveY - Math.floor(self.pageY / 4);
				}

				if (self.pageY > self.maxPageH) {
					self.pageY = _pageY - _moveY - Math.floor((self.pageY - self.maxPageH) / 4);
				}

				self.setPage();

			}

		}, false);

		selfEl.addEventListener('touchend', function(event) {

			event.preventDefault();

			// 隐藏滑块
			self.hideBarTimer = setTimeout(function() {
				self.bar.className = 'm-scroll-bar';
			}, 1500);

			if (event.changedTouches.length == 1) {

				var _touch = event.changedTouches[0],
					_moveY = _touch.pageY - _startY; // 与起点的偏移量

				self.elastic();
				// 是否是快速滑动
				var _time = (new Date()).getTime() - _startTime;

				// 有位移的情况才算快速滑动
				// pageY不能处于零界点
				if (_move && _pageY > 0 && self.pageY < self.maxPageH) {

					var _lv = '0';
					if (_time <= 100 && _move <= 100) {
						// 最快滑动
						_lv = '1';
					}

					if (_time <= 200 && _move <= 200) {
						// 快速滑动
						_lv = '2';
					}

				}
				self.sway(_lv, _moveY);

			}

		}, false);

	},
	update: function(pageY) {
		console.log('update');
		var self = this,
			selfEl = self.el;

		self.pageY = pageY;

		self.content = selfEl.getElementsByClassName('m-scroll-content')[0];

		var _bar = self.content.getElementsByClassName('m-scroll-bar');

		if (_bar.length) {
			self.bar = _bar[0];
		} else {
			self.bar = document.createElement('div');
			self.bar.className = 'm-scroll-bar';

			selfEl.appendChild(self.bar);
		}

		setTimeout(function() {
			self.maxBarTop = self.windowH - self.bar.offsetHeight;
			self.height = self.content.offsetHeight;
			self.maxPageH = self.height - self.windowH;

			self.setPage();
		}, 0);

	},
	unbind: function() {
		console.log('unbind');
	},
	pageY: 0, // 缓存内容的偏移值
	barY: 0, // 缓存滑块的偏移值
	windowH: window.innerHeight, // 当前窗口的高度
	maxBarTop: 0, // 滑块最大top 容器高度 - 滑块高度
	height: 0, // 容器高度
	maxPageH: 0, // 内容高度
	setPage: function() {
		this.content.style.transform = 'translate(0, ' + -this.pageY + 'px)';
		this.barY = (this.pageY / this.maxPageH * this.maxBarTop).toFixed(1);
		this.setBar();
	},
	setBar: function() {

		var _y,
			_p,
			_t;

		if (this.barY < 0) {

			this.barY = 0;
			_p = this.pageY / this.maxBarTop;
			_y = 1 + _p;
			_t = (((-_p) + 0.2) * this.bar.offsetHeight / 2).toFixed(2);

			this.bar.style.transform = 'scale(1, ' + _y.toFixed(2) + ')';
			this.bar.style.top = '-' + _t + 'px';

		} else if (this.barY == 0) {
			this.bar.style.transform = 'scale(1, 1)';
			this.bar.style.top = '0';
		} else if (this.barY > this.maxBarTop) {

			this.barY = this.maxBarTop;

			var _n = this.pageY - this.maxPageH;

			_p = _n / this.maxBarTop;
			_y = 1 - _p;
			_t = ((((_p) + 0.2) * this.bar.offsetHeight / 2) + this.maxBarTop).toFixed(2);

			this.bar.style.transform = 'scale(1, ' + _y.toFixed(2) + ')';
			this.bar.style.top = _t + 'px';

		} else if (this.barY == this.maxBarTop) {
			this.bar.style.transform = 'scale(1, 1);';
			this.bar.style.top = this.maxBarTop + 'px';
		} else {
			this.bar.style.transform = 'scale(1, 1);';
			this.bar.style.top = this.barY + 'px';
		}

	},
	hideBarTimer: '',
	timer: function() {},
	elastic: function() {

		var self = this,
			_max = self.maxPageH;

		if (self.pageY < 0) {

			self.timer = function() {

				var _x = -self.pageY / 40;

				if (self.pageY == 0) {
					return;
				}

				if (self.pageY >= -20) {
					self.pageY = 0;
				} else {
					self.pageY += _x;
				}

				self.setPage();
				setTimeout(self.timer, 5);
			}

		} else if (self.pageY > _max) {

			var _xx = (self.pageY - _max) / 20,
				_ii = 0;
			self.timer = function() {

				if (_ii == 20) {
					return;
				}

				self.pageY -= _xx;

				self.setPage();
				_ii++;
				setTimeout(self.timer, 5);

			}

		}

		self.timer();

	},
	sway: function(level, moveY) {

		var self = this,
			_distance = 0;

		switch (level) {
			case '1':
				_distance = self.maxPageH / 3;
				break;
			case '2':
				_distance = self.maxPageH / 6;
				break;
		}

		if (_distance <= 0) {
			return;
		}

		_distance = Math.floor(_distance);

		var _timer = setInterval(function() {

			if (_distance <= 10) {
				clearInterval(_timer);
				return;
			}

			var _y = Math.floor(_distance / 10);
			_distance -= _y;

			if (moveY <= 0) {

				self.pageY += _y;

			} else {
				self.pageY -= _y;
			}

			// 如果到了零界点
			if (self.pageY < 0) {
				self.pageY = 0;
			}

			if (self.pageY > self.maxPageH) {
				self.pageY = self.maxPageH;
			}

			self.setPage();

		}, 5);

	}
})

Vue.component('app-vue', AppVue)

Vue.use(VueRouter);

var router = new VueRouter();

router.map({
	'/home': {
		name: 'home',
		component: AppHome
	},
	'/list': {
		name: 'list',
		component: AppList
	}
});

router.start(AppVue, '#app');