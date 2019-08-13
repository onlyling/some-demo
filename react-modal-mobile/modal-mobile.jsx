import React from 'react';
import ReactDOM from 'react-dom';

import './modal-mobile.less';

const EL_BODY = document.body;
const EL_HTML = document.getElementsByTagName('html')[0];

// 记录弹窗打开的层级，避免错误的覆盖
let modalIndex = 10;
const getNextIndex = () => {
  return modalIndex++;
};

const CLASSNAME_NOSCROLL = 'noscroll';
// 记录当前状态打卡了多少个弹窗
let modalOpenedNum = 0;
/**
 * 给 html 添加 noscroll 样式
 * @param {boolean} no 是否添加 noscroll
 */
const doNoscroll = (no) => {
  const className = EL_HTML.className;
  if (className === '') {
    if (no) {
      EL_HTML.className = CLASSNAME_NOSCROLL;
      return;
    }
    if (!no) {
      return;
    }
  }
  const classNames = className.split(' ');
  const noClassNames = className.split(' ').filter((c) => c === CLASSNAME_NOSCROLL);
  // 不需要滚动
  if (no && noClassNames.length === 0) {
    EL_HTML.className += ` ${CLASSNAME_NOSCROLL}`;
  }

  // 关闭时检查是否可以恢复滚动
  if (!no && modalOpenedNum === 0 && noClassNames.length > 0) {
    EL_HTML.className = classNames.filter((c) => c !== CLASSNAME_NOSCROLL).join(' ');
  }
};

/**
 * 移动端弹窗
 * @prop {boolean} visible 可见状态
 * @prop {string} title 标题
 * @prop {function} onCancel 关闭回调，如果没有不显示头顶关闭按钮
 * @prop {boolean} modalInput 弹窗中是否有输入框
 */
export default class Node extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    this.modal = React.createRef();
    this.backdrop = React.createRef();
    this.state = {
      curTop: 0, // 当弹窗内有输入框时，转变为 absolute 定位，计算当前 top 值
      curHeight: 0, // 当弹窗内有输入框时，计算可以显示的高度
      curIndex: 0, // 层级，后显示的层级比已打开的高
      visible: false,
      clns: '' // 额外的动画 className
    };
  }

  componentDidMount() {
    EL_BODY.appendChild(this.el);
    // iOS 移动端弹出遮罩层后 禁止页面滚动
    this.backdrop.current.addEventListener('touchmove', this.onTouchmove);
  }

  componentWillUnmount() {
    this.backdrop.current.removeEventListener('touchmove', this.onTouchmove);
    EL_BODY.removeChild(this.el);
    // 来不及关闭被销毁
    if (this.state.visible) {
      modalOpenedNum--;
    }
    doNoscroll(false);
  }

  componentDidUpdate(prevProps, prevState) {
    const self = this;
    const { visible, modalInput } = self.props;

    // 当弹窗开关状态变化时，才做对应的处理
    if (visible !== self.state.visible) {
      // 显示弹窗
      if (visible) {
        // 是否是包含输入项的弹窗
        // 在 iOS 中 fixed 定位的输入框定位有点问题
        if (modalInput) {
          // iOS 中 scrollTop 是 EL_BODY
          // 在 Chrome 开发中是 EL_HTML
          const hscrollTop = EL_HTML.scrollTop;
          const bscrollTop = EL_BODY.scrollTop;

          this.setState({
            curTop: hscrollTop > bscrollTop ? hscrollTop : bscrollTop,
            curHeight: window.innerHeight
          });
        }
        // CSS 中 display 不能过渡
        // 先透明，然后改变透明度
        self.setState({ visible, curIndex: getNextIndex() }, () => {
          setTimeout(() => {
            // 内容恢复到顶部开始
            self.modal.current.scrollTop = 0;
            self.setState({
              clns: 'in'
            });

            // 记录一次打开
            modalOpenedNum++;
            doNoscroll(true);
          }, 0);
        });
      } else {
        if (this.state.clns !== '') {
          self.setState(
            {
              clns: ''
            },
            () => {
              // 500 毫秒和过渡时间一致
              // 在 modal-mobile 上绑定 onTransitionend 事件，有点奇怪
              // Chrome PC 模式上，只能响应 opacity 0 到 1 的过渡，移动端设备模拟器上，0 到 1，1 到 0 都能响应
              // Safari PC 模式和响应设计上都只能响应 0 到 1
              // 暂时没有深究其中的原因
              setTimeout(() => {
                self.setState({
                  visible
                });

                modalOpenedNum--;
                doNoscroll(false);
              }, 500);
            }
          );
        }
      }
    }
  }

  onTouchmove = (event) => {
    event.preventDefault();
  };

  renderModal() {
    const { curTop, curHeight, visible, clns, curIndex } = this.state;
    const { onCancel, title, modalInput } = this.props;

    return (
      <div
        className={`modal-mobile ${modalInput ? 'modal-input' : ''} ${visible ? 'active' : ''} ${clns}`}
        style={{
          top: curTop,
          height: modalInput ? curHeight : 'auto',
          bottom: modalInput ? 'auto' : 0,
          zIndex: curIndex
        }}
        ref={this.modal}
      >
        <div className="modal-backdrop" ref={this.backdrop} />
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-title">
              {title}
              {onCancel ? <span className="modal-close" onClick={onCancel} /> : ''}
            </div>
            <div className="modal-body">{this.props.children}</div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return ReactDOM.createPortal(this.renderModal(), this.el);
  }
}
