var debounce = function (fn, time, immediate) {
    var timer;
    return function () {
        var context = this;
        var args = arguments;
        if (timer) {
            clearInterval(timer);
        }
        if (immediate) {
            var callNow = !timer;
            timer = setTimeout(function () {
                timer = null;
            }, time);
            if (callNow) {
                fn.apply(context, args);
            }
        }
        else {
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, time);
        }
    };
};
