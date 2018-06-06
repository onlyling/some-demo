## 微信小程序 日期时间选择组件

> 目前只支持选择日期时间（yyyy-mm-dd hh:mm:ss）


## 使用方式

正常的引入自定义组件。

```json
{
	"usingComponents": {
		"data-time-picker-single": "../components/data-time-picker-single/data-time-picker-single"
	}
}
```

```html
<data-time-picker-single id="data-picker" bindchange="changeTime" value="{{time}}"></data-time-picker-single>
```


```javascript
Page({
	data: {
		time: '2011-11-11 11:11:11'
	},
	showPicker() {
		// 显示选择层
		this.dataPicker.show();
	},
	changeTime(e) {
		// 当时间改变
		console.log(e); // 2011-11-12 11:11:11
		this.setData({
			time: e
		});
	},
	onRead() {
		// 通过选择器找到组件
		this.dataPicker = this.selectComponent("#data-picker");	}
})
```

## wepy 中使用

```html
<data-time-picker-single id="data-picker" @change="changeTime" value="{{time}}"></data-time-picker-single>
```

```javascript
import wepy from 'wepy';
export default class Index extends wepy.page {
	config = {
        usingComponents: {
            'data-time-picker-single': '../components/data-time-picker-single/data-time-picker-single'
        }
    };
    data = {
    	time: '2011-11-11 11:11:11'
    };
    methods = {
    	changeTime(e) {
    		console.log(e); // 2011-11-12 11:11:11
    		this.time = e;
    	},
		openPicker() {
			this.dataPicker.show();
		}
    };
    onReady() {
        this.dataPicker = this.$wxpage.selectComponent("#data-picker");
    }
}
```

就是这样，喵~