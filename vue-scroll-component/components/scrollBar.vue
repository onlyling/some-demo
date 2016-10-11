<template>
  <div class="m-scroll">
    <div class="m-scroll-content">
      <slot></slot>
    </div>
    <div class="m-scroll-bar"></div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        pageY: 0,
        barY: 0, // 缓存滑块的偏移值
        windowH: window.innerHeight, // 当前窗口的高度
        maxBarTop: 0, // 滑块最大top 容器高度 - 滑块高度
        height: 0, // 容器高度
        maxPageH: 0 // 内容高度
      }
    },
    props: ['scrollY'],
    mounted () {
      const self = this
      const selfEl = self.$el

      self.pageY = self.scrollY
      self.content = selfEl.getElementsByClassName('m-scroll-content')[0]
      self.bar = selfEl.getElementsByClassName('m-scroll-bar')[0]

      setTimeout(function () {
        self.maxBarTop = self.windowH - self.bar.offsetHeight
        self.height = self.content.offsetHeight
        self.maxPageH = self.height - self.windowH

        self.setPage()
      }, 0)

      var _startY = 0
      var _pageY = 0
      var _startTime = 0
      var _move = 0

      // 开始事件
      self.startHandler = function (event) {
        event.preventDefault()

        // 重置一些静态数据，可能一些数据变化，造成一些差异
        self.maxBarTop = self.windowH - self.bar.offsetHeight
        self.height = self.content.offsetHeight
        self.maxPageH = self.height - self.windowH

        // 更新缓存的_pageY
        _pageY = self.pageY

        self.timer = function () {}

        // 显示滑块
        clearTimeout(self.hideBarTimer)
        self.bar.className = 'm-scroll-bar active'

        if (event.targetTouches.length === 1) {
          var _touch = event.targetTouches[0]
          // 记录起点
          _startY = _touch.pageY
          // 记录开始时间
          _startTime = (new Date()).getTime()
          // 记录偏移量
          _move = 0
        }
      }

      // 移动事件
      self.moveHandler = function (event) {
        event.preventDefault()

        if (event.changedTouches.length === 1) {
          const _touch = event.changedTouches[0]
          const _moveY = _touch.pageY - _startY // 与起点的偏移量

          _move = Math.abs(_moveY)

          self.pageY = _pageY - _moveY

          // 当self.pageY超过临界点，应该加一些阻力

          if (self.pageY < 0) {
            self.pageY = _pageY - _moveY - Math.floor(self.pageY / 4)
          }

          if (self.pageY > self.maxPageH) {
            self.pageY = _pageY - _moveY - Math.floor((self.pageY - self.maxPageH) / 4)
          }

          self.setPage()
        }
      }

      // 移动结束事件
      self.endHandler = function (event) {
        event.preventDefault()

        // 隐藏滑块
        self.hideBarTimer = setTimeout(function () {
          self.bar.className = 'm-scroll-bar'
        }, 1500)

        if (event.changedTouches.length === 1) {
          const _touch = event.changedTouches[0]
          const _moveY = _touch.pageY - _startY // 与起点的偏移量

          self.elastic()
          // 是否是快速滑动
          const _time = (new Date()).getTime() - _startTime

          // 有位移的情况才算快速滑动
          // pageY不能处于零界点
          if (_move && _pageY > 0 && self.pageY < self.maxPageH) {
            var _lv = '0'
            if (_time <= 100 && _move <= 100) {
              // 最快滑动
              _lv = '1'
            }

            if (_time <= 200 && _move <= 150) {
              // 快速滑动
              _lv = '2'
            }

            if (_time <= 200 && _move <= 200) {
              // 快速滑动
              _lv = '3'
            }
            self.sway(_lv, _moveY)
          }
        }
      }

      // 绑定事件
      selfEl.addEventListener('touchstart', self.startHandler, false)
      selfEl.addEventListener('touchmove', self.moveHandler, false)
      selfEl.addEventListener('touchend', self.endHandler, false)
    },
    methods: {
      setPage: function () {
        this.content.style.transform = 'translate(0, ' + -this.pageY + 'px)'
        this.barY = (this.pageY / this.maxPageH * this.maxBarTop).toFixed(1)
        this.setBar()
      },
      setBar: function () {
        var _y
        var _p
        var _t
        if (this.barY < 0) {
          this.barY = 0
          _p = this.pageY / this.maxBarTop
          _y = 1 + _p
          _t = (((-_p) + 0.2) * this.bar.offsetHeight / 2).toFixed(2)

          this.bar.style.transform = 'scale(1, ' + _y.toFixed(2) + ')'
          this.bar.style.top = '-' + _t + 'px'
        } else if (this.barY === 0) {
          this.bar.style.transform = 'scale(1, 1)'
          this.bar.style.top = '0'
        } else if (this.barY > this.maxBarTop) {
          this.barY = this.maxBarTop

          var _n = this.pageY - this.maxPageH

          _p = _n / this.maxBarTop
          _y = 1 - _p
          _t = ((((_p) + 0.2) * this.bar.offsetHeight / 2) + this.maxBarTop).toFixed(2)

          this.bar.style.transform = 'scale(1, ' + _y.toFixed(2) + ')'
          this.bar.style.top = _t + 'px'
        } else if (this.barY === this.maxBarTop) {
          this.bar.style.transform = 'scale(1, 1);'
          this.bar.style.top = this.maxBarTop + 'px'
        } else {
          this.bar.style.transform = 'scale(1, 1);'
          this.bar.style.top = this.barY + 'px'
        }
      },
      timer: function () {},
      elastic: function () {
        const self = this
        const _max = self.maxPageH

        if (self.pageY < 0) {
          self.timer = function () {
            let _x = -Math.floor(self.pageY / 25)

            if (self.pageY === 0) {
              return
            }

            if (self.pageY >= -20) {
              self.pageY = 0
            } else {
              self.pageY += _x
            }

            self.setPage()
            setTimeout(self.timer, 16)
          }
        } else if (self.pageY > _max) {
          let _xx = Math.floor((self.pageY - _max) / 15)
          let _ii = 0
          self.timer = function () {
            if (_ii === 15) {
              self.pageY = _max
              self.setPage()
              return
            }

            self.pageY -= _xx
            self.setPage()
            _ii++
            setTimeout(self.timer, 16)
          }
        }

        self.timer()
      },
      sway: function (level, moveY) {
        const self = this
        let _distance = 0

        switch (level) {
          case '1':
            _distance = self.maxPageH / 3
            break
          case '2':
            _distance = self.maxPageH / 4
            break
          case '3':
            _distance = self.maxPageH / 5
            break
        }

        if (_distance <= 0) {
          return
        }

        _distance = Math.floor(_distance)

        let _timer = setInterval(function () {
          if (_distance <= 10) {
            clearInterval(_timer)
            return
          }

          let _y = Math.floor(_distance / 10)
          _distance -= _y

          if (moveY <= 0) {
            self.pageY += _y
          } else {
            self.pageY -= _y
          }

          // 如果到了零界点
          if (self.pageY < 0) {
            self.pageY = 0
          }

          if (self.pageY > self.maxPageH) {
            self.pageY = self.maxPageH
          }

          self.setPage()
        }, 16)
      }
    }
  }
</script>

<style>
  .m-scroll{ height: 100%; width: 3rem; background-color: #fff; position: relative; z-index: 3; overflow: hidden; }
  .m-scroll-bar{ position: absolute; top: 0; right: 0; z-index: 2; width: 5px; height: 40px; background-color: rgba(0,0,0,.3); opacity: 0; transition: opacity 1s; }
  .m-scroll-bar.active{ opacity: 1; }
</style>