const path = require('path');

module.exports = {
    devServer: {
        contentBase: path.join(__dirname, 'dist')
    },
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/js')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["babel-preset-env"]
                    }
                }
            }
        ]
    }
};