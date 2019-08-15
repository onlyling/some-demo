# React 移动端通用弹层组件

**知识点**

`ReactDOM.createPortal` 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案。

iOS 移动端设备输入框在 fixed 的元素上定位有误。

## 结构/布局

参考了 Bootstrap V3 版本的 `模态框 modal.js` 设计。

```html
<div class="modal-mobile">
	<div class="modal-backdrop"></div>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-title">
				<!-- title -->
				<span className="modal-close"><span>
			</div>
			<div class="modal-body"><!-- content --></div>
		</div>
	</div>
</div>
```

**modal-mobile** 整个弹层的显示区域，一般情况是设备的显示区域的大小，Y 轴滚动条

**modal-backdrop** 半透明遮罩层

**modal-dialog** 弹层外层布局元素，可以限制四周的边距

**modal-content** 弹层内容元素，可以开始自定义各种样式

## 有无输入框

如上知识点，在 iOS 设备上，如果在 fixed 定位的元素上添加输入框，当用户聚焦输入框输入内容后，点击其他输入框、按钮会出现错乱点击、聚焦元素上。大概是“当软键盘唤起后，页面的fixed会失效”的缘故。

为了修复这个问题，在含有输入框的弹层上使用 absolute 定位，需要动态计算当然页面 scrollTop，以及页面可见的高度。

使用了 absolute 定位，需要把弹窗元素节点放到最外层，如果嵌套太少，可能受某个父节点影响定位。正好 React 提供了 `ReactDOM.createPortal` 接口，可以把组件渲染到指定节点上。

## 使用方式

```jsx
import React, { useState, useRef } from 'react';

import ModalMobile from '../../components/modal-mobile/modal-mobile';

const DemoNode = () => {
	const [modalV, setModalV] = useState(false);
	const onClickShowModal = () => {
		setModalV(true);
	};
	const onClickHideModal = () => {
		setModalV(false);
	};
	
	return (
		<div>
			<p><span onClick={onClickShowModal}>show modal</span></p>
			<ModalMobile visible={modalV} onCancel={onClickHideModal}>
				<p>content</p>
			</ModalMobile>
		</div>
	);
}

const DemoNode2 = () => {
	const [modalV, setModalV] = useState(false);
	const [name, setName] = useState('');
	const backTimer = useRef(null);
	const CLASSNAME_NOSCROLL = 'noscroll';
	
	const onClickShowModal = () => {
		setModalV(true);
	};
	const onClickHideModal = () => {
		setModalV(false);
	};
	
	const onInputChange = (e) => {
		setName(e.target.value);
	}
	const onInputFocus = () => {
		clearTimeout(backTimer.current);
	}
	const onInputBlur = () => {
		backTimer.current.setTimout(() => {
			// iOS 键盘收起，页面并不会回弹
			if (!!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/))  {
				return;
			}
			
			const EL_HTML = document.getElementsByTagName('html')[0];
			const classNames = EL_HTML.className.split(' ');
			
			EL_HTML.className = classNames.filter((c) => !!c && c !== CLASSNAME_NOSCROLL).join(' ');
			
			// 按实际情况计算回滚多少
			window.scrollTo(0, 0);
			
			EL_HTML.className = classNames.join(' ');
		}, 200);
	}
	
	return (
		<div>
			<p><span onClick={onClickShowModal}>show modal</span></p>
			<ModalMobile visible={modalV} onCancel={onClickHideModal}>
				<p><input type="text" value={name} onChange={onInputChange} /></p>
			</ModalMobile>
		</div>
	);
}
```