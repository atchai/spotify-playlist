module.exports = {
    entry: './src/js/app.js',
    output: {
        path: __dirname + '/dist/js',
        publicPath: '/dist/js/',
        filename: 'spotify-playlist.min.js'
    },
    resolve: {
        root: __dirname,
        modulesDirectories: ['src/js', 'node_modules'],
        alias: {
            // Use lodash instead of Underscore for Backbone
            'underscore': 'lodash'
        }
    },
    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: 'html',
            }
        ]
    }
};
