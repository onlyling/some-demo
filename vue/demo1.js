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
	template: '<div class="m-slide" v-slide="pageY"><div class="m-slide-content"><div class="test-div" v-for="item in items">{{item}}</div></div></div>',
	data: function() {
		return {
			items: ['1', '2', '3', '4', '5', '6', '7', '8'],
			pageY: 100
		}
	}
});

Vue.directive('slide', {
	bind: function() {
		console.log('bind');

		var self = this,
			selfEl = self.el;

		var _startY = 0,
			_pageY = 0;

		// 绑定事件
		selfEl.addEventListener('touchstart', function(event) {

			event.preventDefault();

			self.maxBarTop = self.windowH - self.bar.offsetHeight;
			self.height = self.content.offsetHeight;
			self.maxPageH = self.height - self.windowH;

			_pageY = self.pageY;

			self.timer = function() {};

			if (event.targetTouches.length == 1) {
				var _touch = event.targetTouches[0];
				_startY = _touch.pageY;

			}

		}, false);

		selfEl.addEventListener('touchmove', function(event) {

			event.preventDefault();

			if (event.changedTouches.length == 1) {

				var _touch = event.changedTouches[0],
					_moveY = _touch.pageY - _startY;

				self.pageY = _pageY - _moveY;
				self.setPage();

			}

		}, false);

		selfEl.addEventListener('touchend', function(event) {

			event.preventDefault();

			if (event.changedTouches.length == 1) {
				var _touch = event.changedTouches[0],
					_moveY = _touch.pageY - _startY;

				self.pageY = _pageY - _moveY;
				self.elastic();

			}

		}, false);

	},
	update: function(pageY) {
		console.log('update');
		var self = this,
			selfEl = self.el;

		self.pageY = pageY;

		self.content = selfEl.getElementsByClassName('m-slide-content')[0];

		var _bar = self.content.getElementsByClassName('m-slide-bart');

		if (_bar.length) {
			self.bar = _bar[0];
		} else {
			self.bar = document.createElement('div');
			self.bar.className = 'm-slide-bar';

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
	barY: 0,
	windowH: window.innerHeight,
	maxBarTop: 0,
	height: 0,
	maxPageH: 0,
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
		} else {
			this.bar.style.transform = 'scale(1, 1);';
			this.bar.style.top = this.barY + 'px';
		}

	},
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