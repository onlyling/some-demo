import { createModel } from '@rematch/core';

import * as Datas from '@/apis/index.data';
import * as CommonAPIS from '@/apis';
import * as Store from '@/store';

export interface BaseConfigModelState extends Datas.BaseConfig {
  /** 是否是移动端 */
  isMobile: boolean;
}

/** 更新时候的参数 */
type UpdataParams = {
  [k in keyof BaseConfigModelState]?: BaseConfigModelState[k];
};

const model = {
  state: <BaseConfigModelState>{},
  reducers: {
    /** 同步更新用户信息 */
    update: (state: BaseConfigModelState, payload: UpdataParams) => {
      return {
        ...state,
        ...payload,
      };
    },
  },
  // TODO dispatch: Dispatch 还有些问题，等待修复
  // https://github.com/rematch/rematch/issues/723
  effects: (dispatch: any) => {
    const { BaseConfig } = dispatch as Store.Dispatch;

    return {
      /**
       * 更新基础配置
       */
      async PutConfig() {
        const { data } = await CommonAPIS.GetBaseConfig();

        // 过滤邮箱
        data.contactEmail = data.contactEmail.replace('@', '#');

        BaseConfig.update({
          ...data,
        });
      },
    };
  },
};

export const BaseConfig: typeof model = createModel(model);
