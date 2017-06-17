/* 弹窗
 *
var modal = require('widget/modal/modal')
var modal1 = modal({
    title: '测试',
    body: '<p>32</p>',
    // size: 'sm',
    okCallBack: function (dtd) {
        console.log('ok')
        setTimeout(function () {
            if (Math.floor(Math.random() * 10) >= 5) {
                return dtd.resolve()
            } else {
                return dtd.reject()
            }

        }, 5 * 1000)
    },
    noCallBack: function (dtd) {
        console.log('no')
        setTimeout(function () {
            if (Math.floor(Math.random() * 10) >= 5) {
                return dtd.resolve()
            } else {
                return dtd.reject()
            }

        }, 5 * 1000)
    }
})
modal1.show()
modal1.hide()

dtd 为 deferred 对象
    成功(需要关闭弹窗)   在callBack 中 return dtd.resolve()
    失败(不需要关闭弹窗) 在callBack 中 return dtd.reject('string')
                           string 为提示语，可有可无

 *
 * 如果想借用这个弹出层的样式
 * 只需在原来的弹窗上加一个 `ui-modal-dialog`
 * <div class="modal-dialog ui-modal-dialog" role="document"></div>
 */

define(function (require, exports, module) {

    var $body = $('body')
    var index = 0
    var $modalOverlay = $('#modal-overlay')
    var modalOverlayIndex = 0 // 记录当前打开的对话框个数

    if (!!!$modalOverlay.length) {
        $modalOverlay = $('<div></div>').attr({
            id: 'modal-overlay',
            class: 'modal-overlay fade out'
        })
        $body.append($modalOverlay)
    }

    // 每个modal唯一标识，避免重复
    function nextId() {
        return 'biu-bs-modal-' + index++
    }

    // 创建弹窗html
    function createModalHTML(html, size) {
        return [
            '<div class="modal-dialog ui-modal-dialog' + size + '" role="document">',
            '    <div class="modal-content">',
            html,
            '     </div>',
            '</div>',
        ].join('')
    }

    /**
     * 等待回调操作
     * @param  {[type]} callBack [description]
     * @return {[type]}          [description]
     */
    function waiting(callBack) {
        var dtd = $.Deferred()

        if (callBack) {
            callBack(dtd)
            return dtd.promise()
        } else {
            return dtd.resolve()
        }
    }

    /**
     * 弹窗构造器
     * @param  {[type]} option [description]
     * @return {[type]}        [description]
     */
    function modalClass(option) {
        var self = this

        // 创建html
        var _html = ''
        if (option.title) {
            _html += [
                '<div class="modal-header">',
                '    <button type="button" class="close modal-do-close" data-loading-text="O">&times;</button>',
                '    <h4 class="modal-title">' + option.title + '</h4>',
                '</div>'
            ].join('')
        }

        _html += option.body
        if (option.btnShow) {
            _html += [
                '<div class="modal-footer">',
                '    <button type="button" class="btn btn-default modal-do-close" data-loading-text="取消中..">取消</button>',
                '    <button type="button" class="btn btn-info modal-do-true" data-loading-text="确定中..">确定</button>',
                '</div>'
            ].join('')
        }

        // 弹窗大小
        var _size = ''
        if (option.size) {
            _size = ' modal-' + option.size
        }

        // id
        self.id = nextId()

        self.init(createModalHTML(_html, _size), option.okCallBack, option.noCallBack)

    }

    modalClass.prototype = {
        constructor: modalClass,
        init: function (html, okCallBack, noCallBack) {

            var self = this

            self.$modal = $('<div></div>').addClass('modal fade').attr({
                tabindex: '-1',
                role: 'dialog',
                id: self.id
            })

            self.$modal.html(html)

            $body.append(self.$modal)

            self.$modal.modal({
                backdrop: false,
                keyboard: false,
                show: false
            })

            self.$modal
                .on('click', '.modal-do-close', function () {
                    // self.hide()
                    // noCallBack && noCallBack()

                    var $this = $(this).button('loading')
                    var $ohterBtn = $this.next().prop('disabled', true)

                    $.when(waiting(noCallBack))
                        .done(function () {
                            self.hide()
                            $this.button('reset')
                            $ohterBtn.prop('disabled', false)
                        })
                        .fail(function (err) {
                            if (err) {
                                Tips(err, 3000, 'warning')
                            }
                            $this.button('reset')
                            $ohterBtn.prop('disabled', false)
                        })
                })
                .on('click', '.modal-do-true', function () {
                    // self.hide()
                    // okCallBack && okCallBack()

                    var $this = $(this).button('loading')
                    var $ohterBtn = $this.prev().prop('disabled', true)

                    $.when(waiting(okCallBack))
                        .done(function () {
                            self.hide()
                            $this.button('reset')
                            $ohterBtn.prop('disabled', false)
                        })
                        .fail(function (err) {
                            if (err) {
                                Tips(err, 3000, 'warning')
                            }
                            $this.button('reset')
                            $ohterBtn.prop('disabled', false)
                        })

                })
                .on('show.bs.modal', function () {
                    modalOverlayIndex++
                    if (modalOverlayIndex <= 1) {
                        $modalOverlay.removeClass('out')
                        setTimeout(function () {
                            $modalOverlay.addClass('in')
                        }, 0)
                    }
                })
                .on('hide.bs.modal', function () {
                    modalOverlayIndex--
                    if (!!!modalOverlayIndex) {
                        $modalOverlay.removeClass('in')
                        setTimeout(function () {
                            if (!!modalOverlayIndex) {
                                $modalOverlay.addClass('in')
                            } else {
                                $modalOverlay.addClass('out')
                            }
                        }, 200)
                    }
                })

            return self

        },
        modal: function (str) {
            this.$modal.modal(str)
            return this
        },
        show: function () {
            this.modal('show')
            return this
        },
        hide: function () {
            this.modal('hide')
            return this
        }
    }

    function modal(option) {
        // option
        var defaultOption = {
            title: '',
            body: '',
            btnShow: true, // 是否显示底部的按钮
            size: '', // 三个尺寸 sm 小、lg 大、默认 中
            okCallBack: null,
            noCallBack: null
        }

        var opt = $.extend({}, defaultOption, option)

        return new modalClass(opt)
    }

    modal.alert = function (title, text, okCallBack) {
        if (typeof text == 'function') {
            okCallBack = text
            text = title
            title = ''
        }

        return modal({
            title: title,
            body: text,
            okCallBack: okCallBack
        })
    }

    module.exports = modal

})