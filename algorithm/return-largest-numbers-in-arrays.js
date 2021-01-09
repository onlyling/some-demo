const testNumbers = [
  [2, 3, 4, 5, 23, 562, 3],
  [234, 535, 323, 5345],
  [3244, 434, 3432],
];

/**
 * 方案 1
 * @param {Array<number[]>} nArrs 测试数据
 */
const fn1 = (nArrs) => {
  return nArrs.map((ns) => Math.max.apply(null, ns));
};

console.log(fn1(testNumbers));
