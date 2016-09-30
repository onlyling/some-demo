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
			pageY: 0
		}
	}
});

Vue.directive('slide', {
	bind: function() {
		console.log('bind');
	},
	update: function(pageY) {
		console.log('update');

		var self = this,
			selfEl = self.el;
		self.content = selfEl.getElementsByClassName('m-slide-content')[0];

		self.pageY = +pageY;

		self.content.style.transform = 'translate(0, ' + pageY + 'px)';

		self.bar = document.createElement('div');
		self.bar.className = 'm-slide-bar';

		selfEl.appendChild(self.bar);

		var _startX = 0,
			_startY = 0,
			_endX = 0,
			_endY = 0;

		// 绑定事件
		selfEl.addEventListener('touchstart', function(event) {

			self.maxBarTop = window.innerHeight - self.bar.offsetHeight;

			self.height = self.content.offsetHeight;
			self.maxPageH = self.height - window.innerHeight;

			self.timer = function() {};

			event.preventDefault();

			if (event.targetTouches.length == 1) {
				var _touch = event.targetTouches[0];
				_startX = _touch.pageX;
				_startY = _touch.pageY;
			}

		}, false);

		selfEl.addEventListener('touchmove', function(event) {

			event.preventDefault();

			if (event.changedTouches.length == 1) {
				var _touch = event.changedTouches[0];
				_endX = _touch.pageX;
				_endY = _touch.pageY;

				var _thisMove = self.pageY + _endY - _startY;
				self.setP(_thisMove);
				self.barTop = -(_thisMove / self.maxPageH * self.maxBarTop).toFixed(1);
				self.setBarP();

			}

		}, false);

		selfEl.addEventListener('touchend', function(event) {

			event.preventDefault();

			if (event.changedTouches.length == 1) {
				var _touch = event.changedTouches[0];
				_endX = _touch.pageX;
				_endY = _touch.pageY;

				self.pageY += _endY - _startY;

				if (self.pageY > 0) {
					self.comeBack(self.pageY)
				}

				if (self.pageY < -self.maxPageH) {
					self.comeBack(self.pageY + self.maxPageH);
				}
			}

		}, false);

	},
	unbind: function() {
		console.log('unbind');
	},
	setBarP: function() {
		if (this.barTop <= 0) {
			this.barTop = 0;
		}

		if (this.barTop >= this.maxBarTop) {
			this.barTop = this.maxBarTop;
		}

		console.log(this.barTop);

		this.bar.style.top = this.barTop + 'px';
	},
	setP: function(num) {
		this.content.style.transform = 'translate(0, ' + num + 'px)';
	},
	timer: function() {},
	comeBack: function(distance) {

		var self = this,
			_top = (distance > 0) ? true : false;

		if (_top) {
			self.timer = function() {

				var _x = self.pageY / 60;

				if (self.pageY == 0) {
					return;
				}

				if (self.pageY <= 20) {
					self.pageY = 0;
				} else {
					self.pageY -= _x;
				}

				self.setP(self.pageY);
				setTimeout(self.timer, 5)
			}

		} else {

			var _xx = distance / 20,
				_ii = 0;
			self.timer = function() {

				if (_ii == 20) {
					return;
				}

				self.pageY -= _xx;

				self.setP(self.pageY);
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