const testString =
  "You can start here and read through these docs linearly like a book";

/**
 * 方案 1
 * @param {string} text 测试文字
 */
const fn1 = (text) => {
  let index = 0;
  let max = 0;

  for (let i = 0; i < text.length; i++) {
    if (text[i] === " ") {
      max = Math.max(index, max);
      index = 0;
    } else {
      index++;
    }
  }

  return Math.max(index, max);
};

/**
 * 方案 2
 * @param {string} text 测试文字
 */
const fn2 = (text) => {
  return text.split(" ").reduce((pre, value) => Math.max(pre, value.length), 0);
};

/**
 * 方案 3
 * @param {string} text 测试文字
 */
const fn3 = (text) => {
  return Math.max.apply(
    null,
    text.split(" ").map((v) => v.length)
  );
};

console.log(fn1(testString));
console.log(fn2(testString));
console.log(fn3(testString));
