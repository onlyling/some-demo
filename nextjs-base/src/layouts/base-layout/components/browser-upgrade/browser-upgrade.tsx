import React, { memo } from 'react';
import classnames from 'classnames';

import './browser-upgrade.less';

/**
 * 构建 className
 * @param s 样式后缀
 */
const buildClassName = (s: string) => `base-layout-bu${s}`;

const BrowserUpgrade: React.FC = () => {
  return (
    <div className={classnames(buildClassName(''), 'show')}>
      您正在使用低版本浏览器，请升级浏览器，推荐使用&ensp;
      <a target="_blank" rel="noreferrer" href="https://www.microsoft.com/zh-cn/edge">
        Microsoft Edge
      </a>
      、
      <a target="_blank" rel="noreferrer" href="https://www.google.cn/chrome">
        Chrome
      </a>
      、
      <a target="_blank" rel="noreferrer" href="https://browser.360.cn">
        360极速浏览器
      </a>
    </div>
  );
};

export default memo(BrowserUpgrade);
