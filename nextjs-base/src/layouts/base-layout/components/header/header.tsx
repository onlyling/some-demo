import React, { memo } from 'react';
import Link from 'next/link';
import classnames from 'classnames';

import * as Store from '@/store';

import './header.less';

/**
 * 构建 className
 * @param s 样式后缀
 */
const buildClassName = (s: string) => `base-layout-header${s}`;

const Header: React.FC = () => {
  const config = Store.useSelector((state: Store.RootState) => state.BaseConfig);

  return (
    <div className={buildClassName('')}>
      <div className={classnames('g-page-width', buildClassName('_content'))}>
        <Link href="/">
          <img className={buildClassName('_logo')} src={config.ico} alt={config.platformName} />
        </Link>

        <h1 className={buildClassName('_name')}>
          <Link href="/">{config.platformName}</Link>
        </h1>
      </div>
    </div>
  );
};

export default memo(Header);
