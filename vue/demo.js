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
			pageY: -100
		}
	}
});

Vue.directive('slide', {
	bind: function() {
		console.log('bind');
	},
	update: function(pageY) {
		console.log('update');
		console.log(pageY);

		var self = this,
			selfEl = self.el,
			_content = selfEl.getElementsByClassName('m-slide-content')[0];

		self.pageY = +pageY;

		_content.style.transform = 'translate(0, ' + pageY + 'px)';

		var _bar = document.createElement('div');
		_bar.className = 'm-slide-bar';

		selfEl.appendChild(_bar);

		var _startX = 0,
			_startY = 0,
			_endX = 0,
			_endY = 0;

		// 绑定事件
		selfEl.addEventListener('touchstart', function(event) {

			event.preventDefault();

			if (event.targetTouches.length == 1) {
				var _touch = event.targetTouches[0];
				_startX = _touch.pageX;
				_startY = _touch.pageY;
			}

		}, false);

		selfEl.addEventListener('touchmove', function(event) {

			self.height = _content.offsetHeight;

			event.preventDefault();

			if (event.changedTouches.length == 1) {
				var _touch = event.changedTouches[0];
				_endX = _touch.pageX;
				_endY = _touch.pageY;

				_content.style.transform = 'translate(0, ' + (self.pageY + _endY - _startY) + 'px)';
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

				if (self.pageY < -(self.height - window.innerHeight)) {
					self.comeBack(self.pageY + (self.height - window.innerHeight));
				}
			}

		}, false);

	},
	unbind: function() {
		console.log('unbind');
	},
	comeBack: function(distance) {

		var self = this,
			_top = (distance > 0) ? true : false;

		console.log(distance);

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