module.exports = {
  head: {
    titleTemplate: '%s - 学习',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'renderer', content: 'webkit' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=Edge,chrome=1' },
      { hid: 'keywords', name: 'keywords', content: '你的keywords,我的keywords,她的keywords' },
      { hid: 'description', name: 'description', content: '你的description，我的description，她的description' },
    ]
  },
  build: {
    vendor: ['isomorphic-fetch']
  },
  // loading: false,
  // performance: {
  //   prefetch: false
  // },
}