const throttle = (fn: Function, time: number) => {
  let timer: ReturnType<typeof setTimeout> | null;
  let context: any;
  let previous = 0;
  let args: IArguments;

  const later = () => {
    previous = +new Date();
    timer = null;
    fn.apply(context, args);
  };

  return function (this: any) {
    const now = +new Date();
    const remaining = time - (now - previous);

    context = this;
    args = arguments;

    if (remaining <= 0 || remaining > time) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      previous = now;
      fn.apply(context, args);
    } else if (!timer) {
      timer = setTimeout(later, remaining);
    }
  };
};
