# 浏览器端使用 canvas 做的一个播放按钮，带进度条

![](./demo.gif)

> 演示动图

原本打算在微信小程序上用的，但是微信小程序的 canvas 不能 fixed 定位。如果不需要定位跟随的话，可以使用。

画进度的时候就会发现，圈的边缘会模糊，还是应为高清屏的原因。

纯浏览器端可以试试 [hidpi-canvas-polyfill](https://github.com/jondavidjohn/hidpi-canvas-polyfill) 这个库。