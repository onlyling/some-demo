/**
 * 交换位置
 * @param  {[type]} array [description]
 * @param  {[type]} a     [description]
 * @param  {[type]} b     [description]
 * @return {[type]}       [description]
 */
function swap(array, a, b) {
    let tmp = array[a];
    array[a] = array[b];
    array[b] = tmp;
}

/**
 * 划分
 * @param  {[type]} array [description]
 * @param  {[type]} left  [description]
 * @param  {[type]} right [description]
 * @return {[type]}       [description]
 */
function partition(array, left, right) {
    // 中心点
    const pivot = array[Math.floor((right + left) / 2)];
    let i = left;
    let j = right;

    while (i <= j) {
        // 中心点大于左边 继续向下
        while (pivot > array[i]) {
            i++;
        }
        // 中心点大于右边 进行向上
        while (pivot < array[j]) {
            j--;
        }

        // 交换位置
        if (i <= j) {
            swap(array, i, j);
            i++;
            j--;
        }
    }
    return i;
}

/**
 * 排序
 * @param  {[type]} array [description]
 * @param  {[type]} left  [description]
 * @param  {[type]} right [description]
 * @return {[type]}       [description]
 */
function quick(array, left, right) {
    let index;
    // 当数组至少两个以上才停止排序
    if (array.length > 1) {
        // 第一次排序 得到当前数组的中心分割点
        // 每次从中间划分，不断的遍历
        index = partition(array, left, right);
        // 左数组是否还能排序
        if (left < index - 1) {
            // 起点为左起点
            // 终点为中心点左一个
            quick(array, left, index - 1);
        }
        // 右数组是否还能排序
        if (index < right) {
            // 起点为中心点
            // 终点为右终点
            quick(array, index, right);
        }
    }
    return array;
}

/**
 * 快速排序
 * @param  {[type]} array [description]
 * @return {[type]}       [description]
 */
function quickSort(array) {
    // 第一次排序
    // 起点为 0
    // 终点为 数组末尾
    return quick(array, 0, array.length - 1);
}

// 生成随机整数
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 生成len长度的随机数组
function generateArr(len) {
    let arr = [];
    for (var i = 0; i < len; i++) {
        arr.push(random(1, len));
    }
    return arr;
}

console.log(quickSort(generateArr(30)));