import React, { memo } from 'react';
import { Button } from 'antd';
import classnames from 'classnames';

import CustomIcon from '@/b-components/custom-icon/custom-icon';

import './page-error.less';

interface PageErrorProps {
  status?: '404' | '500';

  text?: string;
}

/**
 * 构建 className
 * @param s 样式后缀
 */
const buildClassName = (s: string) => `c-page-error${s}`;

const ErrorTipMap = {
  '404': 'NOT FOUND 页面未找到...',
  '500': '网络信号丢失...',
};

/**
 * 错误页
 */
const PageError: React.FC<PageErrorProps> = ({ status = '404', text }) => {
  return (
    <div className={buildClassName('')}>
      <div className={classnames(buildClassName('_icon'), `icon-${status}`)} />

      <p className={buildClassName('_text')}>{text || ErrorTipMap[status] || '未知异常'}</p>

      <p className={buildClassName('_btns')}>
        {status === '500' ? (
          <Button
            onClick={() => {
              window.location.reload();
            }}
            type="primary"
            ghost
          >
            <CustomIcon type="iconreload" />
            重新加载
          </Button>
        ) : null}

        <Button href="/" type="primary">
          <CustomIcon type="iconback" />
          返回首页
        </Button>
      </p>
    </div>
  );
};

export default memo(PageError);
