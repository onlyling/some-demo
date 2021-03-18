import type { BaseResponse } from './fetch';
import Fetch, { buildURL } from './fetch';
import type * as Datas from './index.data';

/**
 * 获取基础设置
 */
export const GetBaseConfig = () => {
  return Fetch<BaseResponse<Datas.BaseConfig>>(buildURL('v1/base-config'), {}, 'GET');
};
