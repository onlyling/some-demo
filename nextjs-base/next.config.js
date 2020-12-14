const fs = require('fs');
const path = require('path');
const lessToJS = require('less-vars-to-js');
const withLess = require('@zeit/next-less');
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');
// 一些需要编译的模块，第三方库是 ES6 代码的需要编译一下
const withTM = require('next-transpile-modules')([]);

// Where your antd-custom.less file lives
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './src/assets/less/antd-custom.less'), 'utf8'),
);

const hosts = {
  dev: '',
  test: '',
  production: '',
  online: '',
};
const hostKey = process.env.NODE_HOST || 'dev';
const host = hosts[hostKey];

module.exports = withPlugins(
  [
    [
      // https://github.com/cyrilwanner/next-optimized-images#optimization-packages
      // 安装对应处理器
      optimizedImages,
      {
        /* config for next-optimized-images */
        optimizeImages: false,
      },
    ],
    withTM,
  ],
  withLess({
    poweredByHeader: false,

    // 服务器端、浏览器端通用的配置
    // TODO 服务器端的接口可以使用 127.0.0.1 这样内网地址，浏览器端才使用公网地址
    publicRuntimeConfig: {
      host,
    },

    lessLoaderOptions: {
      javascriptEnabled: true,
      modifyVars: themeVariables, // make your antd custom effective
    },

    webpack: (config, { isServer }) => {
      if (isServer) {
        const antStyles = /antd\/.*?\/style.*?/;
        const origExternals = [...config.externals];
        config.externals = [
          (context, request, callback) => {
            if (request.match(antStyles)) return callback();
            if (typeof origExternals[0] === 'function') {
              origExternals[0](context, request, callback);
            } else {
              callback();
            }
          },
          ...(typeof origExternals[0] === 'function' ? [] : origExternals),
        ];

        config.module.rules.unshift({
          test: antStyles,
          use: 'null-loader',
        });
      }
      return config;
    },
  }),
);
