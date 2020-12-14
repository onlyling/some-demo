import { Models } from '@rematch/core';

import { BaseConfig } from './base-config';

export interface RootModel extends Models {
  BaseConfig: typeof BaseConfig;
}

export const rootModel: RootModel = { BaseConfig };
