/**
 * 向左添加站位符
 * 著名 left-pad 库
 * @param {String|Number} str    需要格式化的数据
 * @param {Number} len           总长度
 * @param {String|Number} ch     占位符
 * @return {String}              格式化后的字符串
 */
const leftpad = (str, len, ch) => {
    str = String(str);
    let i = -1;
    if (!ch && ch !== 0) ch = ' ';
    len = len - str.length;
    while (++i < len) {
        str = ch + str;
    }
    return str;
};

/**
 * 获取两位数
 * @param {String|Number} num 需要格式化的数据
 */
const getDBNumber = (num) => {
    return leftpad(num, 2, '0');
};

/**
 * 格式化时间
 * @param {*} time
 * @param {*} fmt
 */
const timeFormat = (time, fmt) => {
    var o = {
        'M+': time.getMonth() + 1, //月份
        'd+': time.getDate(), //日
        'h+': time.getHours(), //小时
        'm+': time.getMinutes(), //分
        's+': time.getSeconds(), //秒
        'q+': Math.floor((time.getMonth() + 3) / 3), //季度
        S: time.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (time.getFullYear() + '').substr(4 - RegExp.$1.length)
        );
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ?
                o[k] :
                ('00' + o[k]).substr(('' + o[k]).length)
            );
        }
    }
    return fmt;
};

/**
 * 是否是闰年
 * @param {Number} num 判断的年份
 */
const isLeapYear = (year) => {
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        return true;
    } else {
        return false;
    }
};

/**
 * 从某个数字到某个数字
 */
const getNumber = (start, end) => {
    let __arr = [];
    for (let i = start; i <= end; i++) {
        __arr.push(getDBNumber(i));
    }
    return __arr;
};
/**
 * 某年某月的天数
 */
const getMonthDay = (year, month) => {
    let end = 1;
    month = +month;
    switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            end = 31;
            break;
        case 2:
            end = isLeapYear(year, month) ? 29 : 28;
            break;
        default:
            end = 30;
            break;
    }

    return getNumber(1, end);
};

Component({
    properties: {
        value: {
            type: String,
            value: timeFormat(new Date(), 'yyyy-MM-dd hh-mm-ss')
        },
        change: {
            type: Function
        }
    },
    data: {
        pickerYears: getNumber(1900, 2099), // 年
        pickerMonths: getNumber(1, 12), // 月
        pickerDays: [], // 日
        pickerHours: getNumber(0, 23), // 小时
        pickerMinutes: getNumber(0, 59), // 分钟
        pickerSeconds: getNumber(0, 59), // 秒
        pickerTime: [],
        pickerShow: false
    },
    methods: {
        show() {
            this.__openPicker();
        },
        __openPicker() {
            this.setData({
                pickerShow: true
            });
        },
        __closePicker() {
            this.setData({
                pickerShow: false
            });
        },
        __change(e) {
            let {
                pickerYears,
                pickerMonths,
                pickerDays,
                pickerHours,
                pickerMinutes,
                pickerSeconds
            } = this.data;
            let sub = e.detail.value;
            let newPickerDays = getMonthDay(pickerYears[sub[0]], pickerMonths[sub[1]]);
            if (newPickerDays.toString() !== pickerDays.toString()) {
                this.setData({
                    pickerDays: newPickerDays
                });
            }
            let value = `${pickerYears[sub[0]]}-${pickerMonths[sub[1]]}-${newPickerDays[sub[2]]} ${pickerHours[sub[3]]}:${pickerMinutes[sub[4]]}:${pickerSeconds[sub[5]]}`;
            this.triggerEvent('change', value);
        }
    },
    ready() {
        const TODAY_FULL = this.data.value.split(/(-|\s|:)/g).filter((str) => {
            return (/\d/g).test(str);
        });
        this.setData({
            pickerDays: getMonthDay(TODAY_FULL[0], TODAY_FULL[1]), // 日
        }, () => {
            this.setData({
                pickerTime: [+TODAY_FULL[0] - 1900, +TODAY_FULL[1] - 1, +TODAY_FULL[2] - 1, +TODAY_FULL[3], +TODAY_FULL[4], +TODAY_FULL[5]],
            });
        });
    }
});