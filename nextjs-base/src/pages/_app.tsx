import App from 'next/app';
import type { AppProps, AppContext } from 'next/app';
import { Provider } from 'react-redux';

import { useStore, initializeStore } from '@/store';
import BaseLayout from '@/layouts/base-layout/base-layout';
import Head from '@/b-components/head/head';
import * as Helper from '@/helpers';

import '../global.less';

const defaultPageProps = {};

export default function CustomApp({
  Component,
  pageProps = defaultPageProps,
  initialReduxState,
}: AppProps & { initialReduxState: any }) {
  const store = useStore(initialReduxState);

  return (
    <Provider store={store}>
      <BaseLayout>
        <Head />
        <Component {...pageProps} />
      </BaseLayout>
    </Provider>
  );
}

// 初始化 redux
// 初始化全局数据
// 参考：https://github.com/naponmeka/nextjs-typescript-with-rematch/blob/master/lib/withRematch.tsx
CustomApp.getInitialProps = async (appContext: AppContext) => {
  const store = initializeStore();
  const isMobile = Helper.isMobile(appContext.ctx.req);

  await store.dispatch.BaseConfig.PutConfig();

  store.dispatch.BaseConfig.update({
    isMobile,
  });

  const appProps = await App.getInitialProps(appContext);

  // 不放到 pageProps 里面，避免每个组件都接受到 props

  return {
    ...appProps,
    initialReduxState: store.getState(),
  };
};
