import Fetch from 'cross-fetch';
import { message } from 'antd';
import { stringify } from 'qs';
import getConfig from 'next/config';

/** 接口约定的基本参数 */
export type BaseResponse<T> = {
  code: number;
  msg?: string;
  data: T;
};

/** 分页数据基本格式 */
export type BasePaging<T = any> = {
  totalCount: number;
  pageSize: number;
  totalPage: number;
  currPage: number;
  list: T[];
  // 额外添加一个字段，避免多次请求
  fetching: boolean;
  fail: boolean;
  refreshing: boolean;
};

/** Response 分页的返回数据格式 */
export type BaseResponsePaging<T = any> = BaseResponse<BasePaging<T>>;

/** Response 上传文件的返回数据格式 */
export type BaseResponseUpload = BaseResponse<{
  shortUrl: string;
  url: string;
  name: string;
}>;

/** 分页查询参数 */
export type BasePagingParam = {
  page: number | string;
  size: number | string;
};

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'FORM_DATA';

export type AjaxFun = <T = any>(
  url: string,
  data: any,
  method: Method,
  headers?: any,
  isArray?: boolean,
) => Promise<T>;

const { host } = getConfig().publicRuntimeConfig;

/**
 * 构建接口地址
 * @param url 接口地址
 */
export const buildURL = (url: string) => `${host}/api/${url}`;

/** 没有登录延迟对象 避免多个接口同时报错触发多次提示、路由跳转 */
let notLoginMessageTimer: ReturnType<typeof setTimeout>;

/** 显示错误信息 */
const showError = (msg: string) => {
  if (process.browser) {
    message.error(msg);
  }
};

/**
 * @method 通用fetch封装函数
 * @param url 请求url
 * @param data 请求实体参数
 * @param method 请求方式
 * @param headers 请求头部字段
 */
const ajaxFun: AjaxFun = (_url, _data, method, headers = {}) => {
  let url = _url;

  /** 请求参数 */
  // const data = isArray ? _data : { ..._data };
  const data = Array.isArray(_data) ? _data : { ..._data };
  /** fetch 配置项 */
  const params: RequestInit = {
    method,
    headers: {
      ...headers,
    },
  };

  // FORM_DATA 上传 FormData 数据时，不需要手动设置 content-type，不然会报错
  // 如果不是 FORM_DATA 方式，并且自定义 headers 里没有 content-type 就默认一个 content-type
  if (method !== 'FORM_DATA' && !headers['content-type']) {
    params.headers = {
      ...params.headers,
      'content-type': 'application/json',
    };
  }

  // // 是否需要带 token
  // if (!headers.noAuthorization) {
  //   // @ts-ignore
  //   params.headers.Authorization = TokenHelper.getToken();
  // }

  if (method === 'GET' || method === 'DELETE') {
    // 每次请求添加时间戳，避免 GET 请求遭遇 HTTP 缓存
    data._ = new Date().getTime();

    // 请求参数合并到 URL 上
    url += `?${stringify(data, {
      // qs.stringify({ a: ['b', 'c', 'd'] }, { indices: false });
      // 'a=b&a=c&a=d'
      indices: false,
    })}`;
  } else if (method === 'FORM_DATA') {
    // 表单、上传文件
    params.method = 'POST';
    params.body = _data;
  } else {
    params.body = JSON.stringify(data);
  }

  return Fetch(url, params)
    .then((response) => {
      try {
        return response.json();
      } catch (error) {
        throw new Error(`${response.status},${response.statusText}`);
      }
    })
    .then((response) => {
      // 判断是否为接口返回数据, 接口返回结果是否为0，0代表正常
      if (response.code === 0) {
        return response;
      }

      if (response.code === 401) {
        clearTimeout(notLoginMessageTimer);
        notLoginMessageTimer = setTimeout(() => {
          showError(response.msg);
          // TODO 跳转
        }, 300);
      } else {
        showError(response.code ? response.msg : `${response.status},${response.statusText}`);
      }
      return Promise.reject(response);
    });
};

export default ajaxFun;
