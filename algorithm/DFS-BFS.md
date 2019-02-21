# 深度优先遍历、广度优先遍历

## 示例 HTML 代码

```html
<body>
	<div class="parent">
		<div class="child-1">
			<div class="child-1-1">
				<div class="child-1-1-1">
					a
				</div>
			</div>
			<div class="child-1-2">
				<div class="child-1-2-1">
					b
				</div>
			</div>
			<div class="child-1-3">
				c
			</div>
		</div>
		<div class="child-2">
			<div class="child-2-1">
				d
			</div>
			<div class="child-2-2">
				c
			</div>
		</div>
		<div class="child-3">
			<div class="child-3-1">
				f
			</div>
		</div>
	</div>
</body>
```

## 深度优先遍历

深度优先遍历 DFS 与树的先序遍历比较类似。

假设初始状态是示例中所有顶点均未被访问，则从某个顶点v出发，首先访问该顶点然后依次从它的各个未被访问的邻接点出发深度优先搜索遍历图，直至示例中所有和v有路径相通的顶点都被访问到。若此时尚有其他顶点未被访问到，则另选一个未被访问的顶点作起始点，重复上述过程，直至示例中所有顶点都被访问到为止。

```javascript
// 递归实现方式
const deepTraversal1 = (node, nodeList = []) => {
	if (node !== null) {
		nodeList.push(node);
		let children = node.children;
		for (let i = 0; i < children.length; i++) {
			deepTraversal1(children[i], nodeList);
		}
	}
	return nodeList;
}
const deepTraversal2 = (node) => {
	let nodes = [];
	if (node !== null) {
		nodes.push(node);
		let children = node.children;
		for (let i = 0; i < children.length; i++) {
			nodes = nodes.concat(deepTraversal2(children[i]));
		}
	}
	return nodes;
}

// 非递归实现
const deepTraversal3 = (node) => {
	let stack = [];
	let nodes = [];
	if (node) {
		// 推入当前处理的node
		stack.push(node);
		while (stack.length) {
			// 末端弹出一个节点
			let item = stack.pop();
			let children = item.children;
			nodes.push(item);
			
			// 反向导入节点，上层节点先弹出
			for (let i = children.length - 1; i >= 0; i--) {
				stack.push(children[i]);
			}
		}
	}
	return nodes;
}
```

### 输出结果

```bash
0: div.parent
1: div.child-1
2: div.child-1-1
3: div.child-1-1-1
4: div.child-1-2
5: div.child-1-2-1
6: div.child-1-3
7: div.child-2
8: div.child-2-1
9: div.child-2-2
10: div.child-3
11: div.child-3-1
```

## 广度优先遍历

从示例中某顶点v出发，在访问了v之后依次访问v的各个未曾访问过的邻接点，然后分别从这些邻接点出发依次访问它们的邻接点，并使得“先被访问的顶点的邻接点先于后被访问的顶点的邻接点被访问，直至示例中所有已被访问的顶点的邻接点都被访问到。如果此时示例中尚有顶点未被访问，则需要另选一个未曾被访问过的顶点作为新的起始点，重复上述过程，直至示例中所有顶点都被访问到为止。

```javascript
const widthTraversal1 = (node) => {
	let nodes = [];
	let stack = [];
	if (node) {
		// 推入当前处理的node
		stack.push(node);
		while (stack.length) {
			// 头部弹出一个节点
			let item = stack.shift();
			let children = item.children;
			nodes.push(item);
			
			// 正向导入数据，先进先出，队列
			for (let i = 0; i < children.length; i++) {
				stack.push(children[i]);
			}
		}
	}
	return nodes;
}
```

### 输出结果

```bash
0: div.parent
1: div.child-1
2: div.child-2
3: div.child-3
4: div.child-1-1
5: div.child-1-2
6: div.child-1-3
7: div.child-2-1
8: div.child-2-2
9: div.child-3-1
10: div.child-1-1-1
11: div.child-1-2-1
```

更多参考资料：

[深度优先遍历和广度优先遍历](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/9)