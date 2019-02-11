# Typescript 与 axios 友好的搭配使用

## 背景

刚接触 Typescript 不久，使用 React 和 Typescript 倒腾一个小东西。

异步请求一直使用 axios，继续使用它，并且迁移到 Typescript 环境中。

```javascript
import axios from 'axios';
// 接口前缀
const BASE_URL = '/api/v1';

const instance = Axios.create({
	baseURL: `${BASE_URL}`
});

instance.interceptors.request.use((config) => ({
	...config,
	params: {
		...(config.params || {}),
		_: +new Date()
	}
}));

instance.interceptors.response.use(
	(response) => {
		if (response && response.data) {
			return Promise.resolve(response.data);
		} else {
			return Promise.reject('response 不存在');
		}
	},
	(error) => {
		console.log('-- error --');
		console.log(error);
		console.log('-- error --');
		return Promise.reject({
			success: false,
			msg: error
		});
	}
);

export default instance;
```

在 JavaScript 环境中，只是对 axios 进行了简单的配置，并且在拦截器中做了通用的异常处理。

```javascript
import Axios form '../../axios.js';

Axios.get('/xxx').then((data) => {
	console.log(data); // 服务器端返回的数据。
});
```

## 第一次适配

按照 Typescript 的用法调用一次接口。

```javascript
Axios.get('/xxx')
	.then((data) => {
		// 这里提示 类型“AxiosResponse<any>”上不存在属性“success”。
		if (data.success) {
		  
		}
	})
```

如果在 JavaScript 环境，这里是能执行的，拦截器中直接返回了 response.data。

谷歌了一下 Typescript 中如何使用 axios，得到了如下示例。

```typescript
import Axios from 'axios';

interface BaseResponse {
  success: boolean;
  data: [];
  message?: string;
}

Axios.get<BaseResponse>('/xxx')
	.then((data) => {
		data.data.success; // 不会报错了
	})
```

似乎看懂了，.get 等方法后可以跟一个具体的类型，约束服务器返回的格式，并给代码检查提供基础规范。

如果要这样使用，每次验证请求是否成功，要么 `data.data.success` 深层级取数据，要么 .then(data => Promise(data.data)) 多一个 then 把控。

小孩子才做选择，大人两个都不要。

要做一个适配，**既能在 xx.xxx<T>() 传入约束值，也要第一个 .then 的时候拿到服务器返回的值**。

## 第二次适配

想实现上面那个方案，需要自己提供一个请求函数，并且在使用的时候传入一个类型约束。

```typescript
// 基本格式
// 请求函数
const request :<T>(config: AxiosRequestConfig = {}) => Promise<T>
	= function(config) { return new Promise((resolve, reject) => {}) }

// 请求集合中 get 的实现示例
const Ajax = {
	get: function<T>(url: string, params?: object): Promise<T> { return request<T>({ ... }) }
}

```

首先定义一个对象，里面包含 get、post 等字段，都是一个函数，返回一个 Promise 对象。在调用这些函数的时候传入一个数据类型，并且 Promise 返回的就是同一个类型的数据。

request 函数是具体实现如何请求数据，这里参考了 axios 的实现，它也是类似的，基本请求在 request 里实现，.get、.post 都是适配一下参数，调用 request。

```typescript
interface BaseResponse {
  success: boolean;
  data: any;
  message?: string;
}

const request = function<T>(config: AxiosRequestConfig = {}): Promise<T> {
	return new Promise((resolve, reject) => {
		instance
			.request<BaseResponse>(config)
			.then((data) => {
				// 通过断言转换类型
				// 感觉这里这里有坑
				const __data = data.data as any;
				if (__data.success) {
					resolve(__data);
				} else {
					console.log(__data.message);
					reject(__data);
				}
			})
			.catch((e) => {
				reject(e);
			});
	});
};
```

request 具体实现如上，它本身也接受一个类型，返回相同的类型，内部调用了一下 axios 的实例，在 `instance..request<BaseResponse>(config)` 给 axios 本身一个基本的约束。向外返回的 Promise 里的数据，是调用具体接口时给的数据类型，中间套了一层。

```typescript
import GetAxios from '../../axios';
const Ajax = GetAxios();

interface PagerResponse {
  success: boolean;
  data: [];
}

Ajax.get<PagerResponse>('/pager')
	.then((data) => {
		// 没有错误提示
		data.data;
	});
```

[具体的代码](./axios.old.ts)

### 插曲一

在 axios 的 .then 中，resolve 数据是，编辑器一直提示不能把 __data 赋予 <T> 数据类型，已经预示到了坑。最后没法，只要做一次断言转换类型。如果断言成 T 也是有问题

后面和大佬讨论的时候，可以使用 泛型约束 的方式，针对 `T extends BaseResponse` 做约束，但也失效。

### 插曲二

在实现 Ajax 对象的时候，当时想通过动态的新增属性实现，但感觉有点问题。


```typescript
interface BaseAjax {
	[propName: string]: <T>(url: string, config?: object) => Promise<T>;
}

class Ajax: BaseAjax {}

['delete', 'get', 'head', 'options'].forEach((method) => {
	Ajax[method] = function<T>(url: string, params: object = {}): Promise<T> {
		// TODO
	}
});
```

看起来好像可以这样玩，但 ['post', 'put', 'patch']、['delete', 'get', 'head', 'options'] 两组方法参数不同。

## 第三次适配

在和大佬们讨论如何避免那个断言的时候，发现自己的需求有点问题。

在 axios 调用的类型和外层类型是一样的，只需要针对 data 这一个字段动态适配就好了。

```typescript
interface BaseResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
```

首先是基本的返回数据格式中，用一个泛型代替 data 的类型。接着修改 request 里面的内容。

```typescript
const request = <T>(config: AxiosRequestConfig): Promise<BaseResponse<T>> => {
	return new Promise((resolve, reject) => {
		instance.request<BaseResponse<T>>(config).then((data) => {
			const __data = data.data;
			if (__data.success) {
				resolve(__data);
			} else {
				console.log(__data.message);
				reject(__data);
			}
		});
	});
};
```

request 需要一个类型，约束 BaseResponse 里面的 data，BaseResponse 约束 axios 里面的 data.data。再针对包裹层的函数一一修改。[axios 的定义里面也有类似的操作](https://github.com/axios/axios/blob/master/index.d.ts)。

[具体的代码](./axios.ts)

```typescript
import { Ajax } from '../../axios';

type PagerResponse = [];

Ajax.get<PagerResponse>('/pager', {
	params: {
		limit: 10,
		page: newPageNo
	}
}).then((data) => {
	// 无报错，并且对 data 提示 success、data、message?
	const a = [].concat(data.data);
})
```

在具体使用的时候，传入的约束是针对服务器返回的 data 的。

目前感觉 Ajax 那块还是有点繁琐，还可以再优化一下。