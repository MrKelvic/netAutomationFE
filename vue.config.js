// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path')
module.exports = {
    lintOnSave: false,
    publicPath: '',
    configureWebpack: {
        plugins: [
            // new BundleAnalyzerPlugin()
        ], //new webpack.HashedModuleIdsPlugin(),], // so that file hashes don't change unexpectedly],
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                maxInitialRequests: Infinity,
                minSize: 0,
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                            return `n${packageName.replace('@', '')}`;
                        },
                    },
                },
            },
        },
        entry: {
            main: path.resolve(__dirname, 'src/routes/root/root.vue'),
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].[hash].js',
        },
    },

    pwa: {
        name: 'netAuto',
        themeColor: '#434343'
    }
}