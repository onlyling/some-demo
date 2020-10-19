const debounce = (fn: Function, time: number, immediate: boolean) => {
  let timer: ReturnType<typeof setTimeout> | null;

  return function (this: any) {
    const context = this;
    const args = arguments;

    if (timer) {
      clearInterval(timer);
    }

    if (immediate) {
      const callNow = !timer;

      timer = setTimeout(() => {
        timer = null;
      }, time);

      if (callNow) {
        fn.apply(context, args);
      }
    } else {
      timer = setTimeout(() => {
        fn.apply(context, args);
      }, time);
    }
  };
};
