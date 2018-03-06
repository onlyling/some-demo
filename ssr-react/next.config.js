const path = require('path')
const glob = require('glob')

module.exports = {
  webpack: (config, { dev }) => {
    config.module.rules.push(
      {
        test: /\.(css|less)/,
        loader: 'emit-file-loader',
        options: {
          name: 'dist/[path][name].[ext]'
        }
      },
      {
        test: /\.css$/,
        use: ['babel-loader', 'raw-loader', 'postcss-loader']
      },
      {
        test: /\.less$/,
        use: ['babel-loader', 'raw-loader', 'postcss-loader',
          {
            loader: 'less-loader',
            options: {
            }
          }
        ]
      }
    )
    return config
  }
}