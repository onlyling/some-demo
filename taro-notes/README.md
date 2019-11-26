# 记录 Taro 中一些有趣的东西

## 开发环境

```
Taro CLI 1.3.25 environment info:
    System:
        OS: OS X El Capitan 10.11.6
        Shell: 3.2.57 - /bin/bash
    Binaries:
        Node: 8.16.0 - /usr/local/bin/node
        npm: 6.13.1 - /usr/local/bin/npm
```

> 微信小程序开发中遇见的一些小麻烦

## Mobx 在 JSX 中正确的使用方式

> Mobx 暂时只能在 Class 组件中使用。

参考文档 [将组件设置为监听者，以便在可观察对象的值改变后触发页面的重新渲染。](https://taro-docs.jd.com/taro/docs/mobx.html#observer)

```jsx
// 错误，在小程序中值改变后将无法触发重新渲染
const { counterStore } = this.props;
return (
  <Text>{counterStore.counter}</Text>
)

// 正确
const { counterStore: { counter } } = this.props;
return (
  <Text>{counter}</Text>
)
```

如果 `counter` 是一个对象（赋址类型）的数据，这不会触发更新，可以在 render 函数内申明一个变量。

```jsx
const { counterStore } = this.props;
const localCounter = counterStore.counter;
return (
  <Text>{localCounter}</Text>
)
```

这样如果是赋址类型的数据也会触发更新，但是，有时候操作数据并不会更新，需要重新生成一个新的变量才行。

```jsx
const { counterStore } = this.props;
const localCounter = counterStore.counter;
const localList = counterStore.list.map((v) => v);
return (
    <Block>
        <Text>{localCounter}</Text>
        {localList.map((s) => <View key={s}>{s}</View>})}
    </Block>
 )
```

按理说，在 render 里面声明的变量在编译后都会塞到小程序页面或组件的 state 里面，render 操作的时候就是 setState，接下来或许能解释了。

在 Mobx 的 state 里面，有一个 User modal，用来缓存用户信息的。

```js
import { observable, action } from 'mobx';

class User {
    @observable UserInfo = {};
    
    /**
   * 检查是否登录
   */
  @action checkLogin = () => {
    return this.UserInfo.id && this.UserInfo.id !== -1;
  };
  
  /** 更新用户资料 */
  @action updateUserInfo = (user = {}) => {
    this.UserInfo = user;
  };
}
```

业务结构大致是这样，在某个页面/组件中 @inject('User') @observer 组件，在 render 中 `const userLogined = this.props.User.checkLogin()` 判断用户是否登录，在登录页面 `updateUserInfo` 用户信息，数据已经更新了，但是 `userLogined` 相关的组件并没有触发更新，在组件内添加 `componentWillReact` 也没有触发，有点奇怪。

可能是对 Mobx 运用不熟悉，checkLogin 并没有监听，受监听的 UserInfo 并没有使用到，所以无法更新？按照以往在浏览器端使用 redux 的经历，整个 User 有一个数据更新都会触发组件更新。

在组件内，声明 `const UserInfo = this.props.User.UserInfo;` ，使用 `UserInfo.id` 的方式判断是否登录，页面触发了更新。可能是小程序上一些限制造成的吧。

## JSX 中的注意

### Block 的使用

在 React 中，可以使用 React.Fragment 包裹多个子组件而不生成一个单独的父组件，Taro 中也可以使用 Block 实现类似的功能。

```jsx
// 错误 不会触发更新
const Demo = ({more = false}) => {
    if(more) {
        return <Block><Text>1</Text><Text>2</Text></Block>
    }
    
    return <Text>1</Text>
}
// 正确
const Demo = ({more = false}) => {
    if(more) {
        return <Block><Text>1</Text><Text>2</Text></Block>
    }
    
    return <Block><Text>1</Text></Block>
}
```
总之你 Block 我 Block。

### xxx.map(() => {})

在 map 函数中尽量不要再嵌套内的 .map函数内单独声明变量，在结合三元运行时这些变量可能在编译中搞错。



