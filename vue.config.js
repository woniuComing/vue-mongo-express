const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// console.log(path.join('/foo', 'bar', 'baz/asdf', 'quux', '..'))
module.exports = {
    configureWebpack: {
        plugins: [new BundleAnalyzerPlugin()]
    },
    // configureWebpack: {
    //     resolve: {
    //         alias: {
    //             '@': path.join(__dirname, '../../src'),
    //         }
    //     }
    // },
    lintOnSave: false,
    devServer: {
        // disableHostCheck: true,
        port: 8080,
        // proxy: 'http://127.0.0.1:3000',
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:3000',
                changeOrigin: true,
            }
        },
    }
}