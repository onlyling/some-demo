# 返回上一级的一波多折

## 背景

![返回上一级](./back.png)

在网页中经常会看到返回上一级（或者是返回上一页）的操作，可以通过最简单的 `history.back()` 回到当前窗口访问历史的上一页。

现在来回顾一下某个项目返回上一级的改动。

## 版本一

在第一个版本中，我们大体分为两类处理方式，一个是 `history.back()`，另一个是在 a 标签上写上一级的链接。

第一类从哪儿来回哪儿去，看起来很棒，但不通用，例如到了分页列表大于第二页，想回到上一级，只是回到了上一页。

第二类精准返回，但从详情页回到列表页，搜索参数丢失，再去翻页很麻烦。

两个都怎么靠谱，勉强维持用户体验。

## 版本二

在不改动服务端代码的情况下，实现详情页返回列表保留搜索参数。

最简单的方式是把链接改成 `history.back()` 就好了。

仔细想，如果直接访问详情页，返回上一级怎么办？`history.back()` 会回到空白页。

比较好的结果是有历史记录回到历史上一页，没有就回到列表第一页。

首先我们约定返回上一级的代码格式。

```html
<a href="/to-list-or-other" id="j-go-back">&lt; 返回上一级</a>
```

返回上一级的元素都通用一个 `id` 名称，然后 `href` 是真实上一级的地址。

```javascript
function initWebPageBack() {
    $('#j-go-back').on('click', function(e) {
        if (document.referrer && history.length > 1 && document.referrer.indexOf(location.pathname) < 0) {
            history.back();
            return false;
        }
    });
}
```

接着通过 js 去判断如何返回。

如果当前页有访问来源、历史记录大于 1（排除新开窗口）、来源和当前页不是一个路径（排除分页列表），那就返回历史上一页，其他的都通过 a 标签的链接跳转。

这么一个改动，又能勉强维持用户体验了。

这里得注意，上线有风险的。

* 如果列表是 POST 的方式，返回历史上一页，可能会被防重复提交；
* 返回历史上一页可能提示访问过期；
* 返回历史上一页可能页面不刷新；

最后还是需要改一些服务器配置才能搞定，另外还有一些其他小问题。

## 版本三

在测试不断的试错中发现一个比较有趣的问题。

1. 点击一个链接，新窗口打开；
2. 点击返回上一级，本窗口回到父级目录；
3. 点击浏览器返回上一页按钮；
4. 再次点击返回上一级，页面没有变化；

通过观察，在第 4 步的时候，当前页面完全满足 `document.referrer && history.length > 1 && document.referrer.indexOf(location.pathname` 判断条件，它在历史记录索引的顶层，没法再返回上一页了。

后来只好尝试一下是否已经调整的判断，然后再页面跳转到返回元素节点上指定的地址。

改良一下 js 的判断。

```javascript
function initWebPageBack() {
    $('#j-go-back').on('click', function(e) {
        // 是否存在打开页面的入口 是
        // 是否有历史记录 是
        // 是否入口和当前页一致 否  分页之类的
        // 返回历史的上一页，否则打开链接
        if (document.referrer && history.length > 1 && document.referrer.indexOf(location.pathname) < 0) {
            var oldOnbeforeunload = window.onbeforeunload; // 缓存旧的 后面还原，避免可能错乱的事件
            var isBack = false; // 标记是否已经返回了
            var href = this.href; // 缓存原生链接

            // 绑定离开判断
            window.onbeforeunload = function() {
                isBack = true;
                window.onbeforeunload = oldOnbeforeunload;
            };

            // 触发返回历史上一页
            history.back();

            // 假设没能跳转正常，就去链接上的地址
            setTimeout(function() {
                // 如果没有返回手动触发到原生链接
                // 真的出现了这个问题
                // 新打开页面，返回上一级，通过历史记录回来，再次点击返回上一级，没有响应
                // 当前页面在历史记录索引的顶层，没法 back 了。通过监听 onbeforeunload 判断是否响应了
                if (!isBack) {
                    holdHref(href);
                }
            }, 200);

            // 拒绝原生链接跳转
            return false;
        }
    });
}
```

再次勉强维持用户体验，该有的风险并没有彻底解决。