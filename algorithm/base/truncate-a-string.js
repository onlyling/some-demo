/**
 * 方案 1
 * @param {string} text 测试数据
 * @param {number} n 保留个数
 */
const fn1 = (text, n) => {
  if (text.length <= n) {
    return text;
  }

  return `${text.slice(0, n - 1)}...`;
};

console.log(fn1("1234567890", 11));
console.log(fn1("使用中文获取比较好看些", 6));
console.log(fn1("使用中文获取", 6));
