var throttle = function (fn, time) {
    var timer;
    var context;
    var previous = 0;
    var args;
    var later = function () {
        previous = +new Date();
        timer = null;
        fn.apply(context, args);
    };
    return function () {
        var now = +new Date();
        var remaining = time - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > time) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            previous = now;
            fn.apply(context, args);
        }
        else if (!timer) {
            timer = setTimeout(later, remaining);
        }
    };
};
