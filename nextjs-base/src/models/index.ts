import type { Models } from '@rematch/core';

import { BaseConfig } from './base-config';

export interface RootModel extends Models<RootModel> {
  BaseConfig: typeof BaseConfig;
}

export const models: RootModel = { BaseConfig };
