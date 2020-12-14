import React, { memo } from 'react';
import NextHead from 'next/head';

import { buildURL } from '@/apis/fetch';
import * as Store from '@/store';

export interface HeadProps {
  /**
   * 页面 title
   */
  title?: string;

  /**
   * 页面关键词
   */
  keywords?: string;

  /**
   * 页面描述
   */
  description?: string;
}

// https://tool.oschina.net/jscompress/
// 在线压缩
// (function () {
//   if (typeof window === 'object') {
//     var DEFAULT_VERSION = 11;
//     var ua = navigator.userAgent.toLowerCase();
//     var isIE = ua.indexOf('msie') > -1;
//     var arr = ua.match(/msie ([\\d.]+)/) || [];

//     if (isIE && arr.length >= 2) {
//       if (+arr[1] < DEFAULT_VERSION) {
//         var styleEl = document.createElement('style');
//         styleEl.innerHTML = '.base-layout-bu.show{display:block;}';
//         var s = document.getElementsByTagName('script')[0];
//         s.parentNode.insertBefore(styleEl, s);
//       }
//     }
//   }
// })();
/** 浏览器检测 */
const JS_CHECK_IE_CODE =
  ';(function(){if(typeof window==="object"){var DEFAULT_VERSION=11;var ua=navigator.userAgent.toLowerCase();var isIE=ua.indexOf("msie")>-1;var arr=ua.match(/msie ([\\d.]+)/)||[];if(isIE&&arr.length>=2){if(+arr[1]<DEFAULT_VERSION){var styleEl=document.createElement("style");styleEl.innerHTML=".base-layout-bu.show{display:block;}";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(styleEl,s)}}}})();';

/**
 * 自定义 header
 */
const Head: React.FC<HeadProps> = ({ children, title, keywords, description }) => {
  const config = Store.useSelector((state: Store.RootState) => state.BaseConfig);

  /** title 标题 */
  const titleText = `${title ? `${title} - ` : ''}${config.seoTitle || config.platformName}`;

  /** 关键词 */
  const keywordsText = keywords || config.seoKeywords || config.platformName;

  /** 描述 */
  const descriptionText = description || config.seoDescription || config.platformName;

  return (
    <NextHead>
      <link key="icon" rel="icon" href={buildURL('v1/base-config/ico')} />
      <meta key="renderer" name="renderer" content="webkit" />
      <meta key="IE=edge,chrome=1" httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      <meta key="no-siteapp" httpEquiv="Cache-Control" content="no-siteapp" />
      <meta
        key="viewport"
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, viewport-fit=cover"
      />
      <title>{titleText}</title>
      <meta name="keywords" content={keywordsText} />
      <meta name="description" content={descriptionText} />
      <script key="headScript" dangerouslySetInnerHTML={{ __html: JS_CHECK_IE_CODE }} />
      {children}
    </NextHead>
  );
};

export default memo(Head);
