/**
 * 方案 1
 * @param {any} data 测试数据
 */
const fn1 = (data) => {
  return typeof data === "boolean";
};

/**
 * 方案 2
 * @param {any} data 测试数据
 */
const fn2 = (data) => {
  return Object.prototype.toString.call(data) === "[object Boolean]";
};

console.log(fn1(true));
console.log(fn1(false));
console.log(fn1(1));
console.log(fn1("2"));
console.log(fn1({}));
console.log(fn1([]));
console.log(fn1(() => {}));
console.log(fn1(null));
console.log('------');
console.log(fn2(true));
console.log(fn2(false));
console.log(fn2(1));
console.log(fn2("2"));
console.log(fn2({}));
console.log(fn2([]));
console.log(fn2(() => {}));
console.log(fn2(null));