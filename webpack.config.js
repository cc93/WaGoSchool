var webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: './js/index-1.2.js',
  output: {
    path: __dirname + '/build',
    publicPath: '/build/',
    filename: 'index-1.2.js'
  },
  module: {
    //preloaders:[
    //  { test: /\.js$/, loader: 'eslint', include: /js/}
    //],
    loaders: [
      { test: /\.js$/, loader: 'babel', include: /js/, query:{presets:['es2015','react']}},
      //{ test: /\.css$/,  loader: "style!css" },
      //{ test: /\.jp(e)?g|png|gif|svg|ttf|eot|woff|woff2$/, loader:'url?limit=8192&name=./build/[hash].[ext]'},
      //{ test: /\.svg|ttf|eot|woff|woff2$/, loader:'file&name=./build/[hash].[ext]'}
    ]
  },
  plugins: [
    new webpack.DefinePlugin({PRODUCTION: JSON.stringify(process.env.NODE_ENV === 'production')})
  ],
  devtool: '#eval'
};

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map';
  module.exports.plugins = (module.exports.plugins || []).concat([
      new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
    new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.NoErrorsPlugin()
  ]);
}

