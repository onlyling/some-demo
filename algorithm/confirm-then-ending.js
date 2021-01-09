/**
 * 方案 1
 * @param {string} text 测试数据
 * @param {string} conf 对比数据
 */
const fn1 = (text, conf) => {
  return new RegExp(`${conf}$`).test(text);
};

/**
 * 方案 2
 * @param {string} text 测试数据
 * @param {string} conf 对比数据
 */
const fn2 = (text, conf) => {
  if (conf.length > text.length) {
    return false;
  }

  for (let index = 1; index <= conf.length; index++) {
    const tIndex = text.length - index;
    const cIndex = conf.length - index;

    if (text[tIndex] !== conf[cIndex]) {
      return false;
    }
  }

  return true;
};

/**
 * 方案 3
 * @param {string} text 测试数据
 * @param {string} conf 对比数据
 */
const fn3 = (text, conf) => {
  if (conf.length > text.length) {
    return false;
  }

  const nText = text.slice(-conf.length);

  return nText === conf
};

console.log(fn1("434sdfsdf4324", "4"));
console.log(fn1("434sdfsdf4324", "14"));
console.log(fn1("434sdfsdf4324", "2"));
console.log(fn1("4", "14"));
console.log(fn1("4", "4"));
console.log('------');
console.log(fn2("434sdfsdf4324", "4"));
console.log(fn2("434sdfsdf4324", "14"));
console.log(fn2("434sdfsdf4324", "2"));
console.log(fn2("4", "14"));
console.log(fn2("4", "4"));
console.log('------');
console.log(fn3("434sdfsdf4324", "4"));
console.log(fn3("434sdfsdf4324", "14"));
console.log(fn3("434sdfsdf4324", "2"));
console.log(fn3("4", "14"));
console.log(fn3("4", "4"));
