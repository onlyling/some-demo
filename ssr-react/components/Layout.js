import 'isomorphic-fetch'

import Head from 'next/head'
import ActiveLink from './ActiveLink'

const TOP_NAVS = [{
  text: '首页',
  href: '/'
}, {
  text: '前端',
  href: '/fe'
}, {
  text: 'Android',
  href: '/android'
}, {
  text: 'iOS',
  href: '/ios'
}]

export default ({ children,
  title = '主页',
  keywords = '你的关键词,我的关键词,他的关键词,默认关键词',
  description = '你的页面描述'
                }) => [
    (<Head key="head">
      <title>{title}</title>
      <meta name="keywords" content={keywords} />
      <meta name="description" content={description} />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>),
    (<div className="top-navs" key="nav">
      <ul>
        {TOP_NAVS.map((nav, i) => {
          return (<li key={i}><ActiveLink href={nav.href}>{nav.text}</ActiveLink></li>)
        })}
      </ul>
    </div>),
    (<div className="list-box" key="list">
      {children}
    </div>),
  ]