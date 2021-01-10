/**
 * 方案 1
 * @param {number[]} numbers 测试数据
 * @param {(n:number)=>boolean} fn 逻辑函数
 */
const fn1 = (numbers, fn) => {
  let n;

  // filter 虽然要把数组的全部执行完，但时间复杂程度都是一样的。
  numbers.some((num) => {
    if (fn(num)) {
      n = num;
    }

    return n;
  });

  return n;
};

console.log(fn1([1, 2, 3, 4, 5, 6, 7], (n) => n >= 3));
console.log(fn1([1, 2, 3, 4, 5, 6, 7], (n) => n >= 10));
