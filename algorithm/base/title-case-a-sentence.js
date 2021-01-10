/**
 * 方案 1
 * @param {string} text 测试数据
 */
const fn1 = (text) => {
  return text.toLocaleLowerCase().replace(/(^\w)|(\s\w)/g, ($) => {
    return $.toLocaleUpperCase();
  });
};

/**
 * 方案 2
 * @param {string} text 测试数据
 */
const fn2 = (text) => {
  let t = text[0].toLocaleUpperCase();

  for (let index = 1; index < text.length; index++) {
    t +=
      text[index - 1] === " "
        ? text[index].toLocaleUpperCase()
        : text[index].toLocaleLowerCase();
    // ? text[index].toLocaleLowerCase()
    // : text[index];
  }

  return t;
};

console.log(fn1("Fd adD dsf"));
console.log(fn2("Fd adD dsf"));
