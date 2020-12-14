import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { useRouter } from 'next/router';
import zhCN from 'antd/lib/locale/zh_CN';

import Header from './components/header/header';
import Footer from './components/footer/footer';
import BrowserUpgrade from './components/browser-upgrade/browser-upgrade';

import './base-layout.less';

/**
 * 基础布局
 */
const Layout: React.FC<any> = (props) => {
  const router = useRouter();

  // 每当路由变化、页面切换，回到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [router.pathname, router.query]);

  return (
    <ConfigProvider locale={zhCN}>
      <div className="base-layout">
        <BrowserUpgrade />

        <Header />

        <div className="base-layout-body">{props.children}</div>

        <Footer />
      </div>
    </ConfigProvider>
  );
};

export default Layout;
