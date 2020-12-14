import React, { memo } from 'react';
import classnames from 'classnames';

import CustomIcon from '@/b-components/custom-icon/custom-icon';
import * as Store from '@/store';

import './footer.less';

/**
 * 构建 className
 * @param s 样式后缀
 */
const buildClassName = (s: string) => `base-layout-footer${s}`;

/**
 * 通用页尾
 */
const Footer: React.FC = () => {
  const config = Store.useSelector((state: Store.RootState) => state.BaseConfig);

  const infos = [
    {
      text: `联系电话：${config.contactNumber}`,
      icon: 'iconFrame-26',
    },
    {
      text: `邮编：${config.concatPostcode}`,
      icon: 'iconpostcode',
    },
    {
      text: config.contactAddress,
      icon: 'iconaddress',
    },
  ];

  return (
    <>
      <div className={classnames('g-page-width', buildClassName('_info'))}>
        {infos.map((info) => (
          <div key={info.icon} className={buildClassName('_info-item')}>
            <span className={buildClassName('_info-icon')}>
              <CustomIcon type={info.icon} />
            </span>

            <span>{info.text}</span>
          </div>
        ))}
      </div>

      <div className={buildClassName('_copyright')}>{config.copyright}</div>
    </>
  );
};

export default memo(Footer);
