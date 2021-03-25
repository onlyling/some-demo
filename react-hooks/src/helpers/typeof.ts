const isType = (
  t: 'Array' | 'Object' | 'Function' | 'String' | 'Number' | 'Null' | 'Undefined',
) => (v: any) => Object.prototype.toString.call(v) === `[object ${t}]`;

/** 是数组 */
export const isArray = <T>(v: T[]): v is T[] => isType('Array')(v);

/** 是对象 */
export const isObject = <T>(v: T): v is T => isType('Object')(v);

/** 是函数 */
export const isFunction = (v: any): v is Function => isType('Function')(v);
