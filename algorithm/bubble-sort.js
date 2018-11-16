/**
 * 快速冒泡 升序
 * 每次取一个下标的值依次对比两个相邻的值，前一个大于后一个就交换位子，确定第一位最小，最后一位最大
 * 从 0 到 n 依次对比（for let i = 0 的循环）
 * 由 i 依次像最后对比，每次循环确定倒数第 i 个大于前面所有的
 *
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
function bubbleSortASC(arr) {
    const maxLength = arr.length - 1;

    for (let i = 0; i < maxLength; i++) {
        for (let j = 0; j < maxLength - i; j++) {
            if (arr[j] > arr[j + 1]) {
                let tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;
            }
        }
    }

    return arr;
}

console.log(bubbleSortASC([3, 4, 2, 67, 22, 46, 24, 87]));

/**
 * 冒泡排序
 * @param  {Array}  arr   [description]
 * @param  {Boolean} isASC [是否升序]
 * @return {Array}        [description]
 */
function bubbleSort(arr, isASC) {
    const maxLength = arr.length - 1;

    for (let i = 0; i < maxLength; i++) {
        for (let j = 0; j < maxLength - i; j++) {
            let isExchange = false;
            if (isASC && arr[j] > arr[j + 1]) {
                isExchange = true;
            }
            if (!isASC && arr[j] < arr[j + 1]) {
                isExchange = true;
            }
            if (isExchange) {
                let tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;
            }
        }
    }

    return arr;
}

console.log(bubbleSort([3, 4, 2, 67, 22, 46, 24, 87]));
console.log(bubbleSort([3, 4, 2, 67, 22, 46, 24, 87], true));