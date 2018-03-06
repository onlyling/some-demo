import Document, { Head, Main, NextScript } from 'next/document'
import flush from 'styled-jsx/server'

import resetCSS from 'styles/reset.less'
import layoutCSS from 'styles/layout.less'

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const { html, head, errorHtml, chunks } = renderPage()
    const styles = flush()
    return { html, head, errorHtml, chunks, styles }
  }

  render() {
    return (
      <html lang="zh-cmn-Hans">
        <Head>
          <meta name="renderer" content="webkit" />
          <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" />
          <meta http-equiv="Cache-Control" content="no-siteapp" />
          <style dangerouslySetInnerHTML={{ __html: resetCSS }} />
          <style dangerouslySetInnerHTML={{ __html: layoutCSS }} />
        </Head>
        <body>
          {this.props.customValue}
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}