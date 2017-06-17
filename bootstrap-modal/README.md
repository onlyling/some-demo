# 基于Bootstrap简单封装一个弹窗

## 背景

项目中选用了 `Bootstrap` 作为基础，但是自带的弹窗有点不满足需求，嗯，动手改一改。

## 弹窗是什么样

从一个[中文文档](http://v3.bootcss.com/javascript/#modals-examples)中拔了一个demo，弹出的效果也蛮不错的。弹出的同时还有遮罩层，点击遮罩层还可以关闭弹出，另外，编程方式也可以使用。

``` html
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">Modal title</h4>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
```

但是从监听的事件中，有几点不是很满足需求。

理想状态，点击 `关闭` 执行对应的回调，点击 `确定` 执行对应的回调，提供的事件中，只有 `显示`、`关闭` 两大类。

## 一个标准的封装

大概习惯了这样去封装一个类 -、-

```javascript
var index = 0 // 标记

// 每个modal唯一标识，避免重复
function nextId() {
    return 'biu-bs-modal-' + index++
}

function modalClass() {}

modalClass.prototype = {
    constructor: modalClass,
    init: init() {}
}
```

基本的想法是，js手动拼一个弹出的html，然后追加到 `body` 的尾部，然后使用js的方式弹出、打开弹出层。

## 遇见的问题

1.点击遮罩层关闭弹窗，怎么办呢

在弹窗配置中 `backdrop` 取消它就不会有遮罩层，但是，不符合需求。

那么，就自己搞一个遮罩层，然后使用自带的遮罩层的样式。

2.点击确定，需要根据接口判断是否关闭弹出层

部分业务中存在确定事件并不一样每次都会关闭弹出层，例如一些数据交互的地方。

没办法咯，只好使用jQuery自带的 `deferred` 来解决咯。

3.快速生成一个弹窗

经常会遇见一些需求，例如只是弹出一句话，例如原生的alert那样的，但是，每次都要写一个完整的配置项，似乎很麻烦。

于是，用一个方法在简单分装一下，快速生成对应的配置。
