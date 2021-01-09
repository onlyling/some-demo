/**
 * 方案 1
 * @param {string} text 测试数据
 * @param {number} n 重复次数
 */
const fn1 = (text, n) => {
  if (n <= 0) {
    return "";
  }

  return new Array(n).fill(text).join("");
};

/**
 * 方案 2
 * @param {string} text 测试数据
 * @param {number} n 重复次数
 */
const fn2 = (text, n) => {
  if (n <= 0) {
    return "";
  }

  let t = "";

  for (let index = 0; index < n; index++) {
    t += text;
  }

  return t;
};

console.log(fn1("*", 3));
console.log(fn1("*", 1));
console.log(fn1("*", -2));
console.log("------");
console.log(fn2("*", 3));
console.log(fn2("*", 1));
console.log(fn2("*", -2));
