import webpack from 'webpack';
import { join } from 'path';
import resolveToProjectLevel from '../tools/webpack/resolve-local';
import fs from 'fs';

const env = process.env.NODE_ENV;

const EXCLUDE_MODULES = [
    'reflecti',
    'nbp-skills-cluster',
    'nbp-rules',
    'nbp-adapter-fb-messenger',
    'nbp-logger',
    'nbp-adapter-wit',
    'nbp-adapter-memcached',
    'nbp-adapter-google-natural-language',
    'nbp-adapter-google-datastore'
];
const nodeModules = {};
fs.readdirSync('node_modules')
    .filter((x) => ['.bin'].indexOf(x) === -1)
    .forEach((mod) => {
        if (!~EXCLUDE_MODULES.indexOf(mod)) {
            nodeModules[mod] = `commonjs ${mod}`;
        }
    });

// const resolve = (path) => join(__dirname, `../src/${path}`);

const config = {
    target: 'node',
    entry: [
        'babel-polyfill',
        './src/index.js'
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules\/(?!reflecti|nbp-skills-cluster|nbp-rules)/,
                query: {
                    cacheDirectory: false,
                    presets: resolveToProjectLevel(['babel-preset-es2015'])
                }
            },
            {
                test: /\.json$/,
                loader: 'json'
            }
        ]
    },
    resolve: {
        alias: {
            libs: join(__dirname, '../src/libs'),
            'skills-cluster': join(__dirname, '../src/libs/cluster/factory.js'),
            config: join(__dirname, '../src/config/index.js'),
            logger: join(__dirname, '../src/libs/logger.js')
        }
    },
    node: {
        __dirname: true,
        __filename: true
    },
    resolveLoader: { fallback: join(__dirname, 'node_modules') },
    externals: nodeModules,
    output: {
        path: join(__dirname, `../dist`),
        filename: 'index.js'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(env)
        })
    ]
};

if (env === 'production') {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                screw_ie8: true,
                warnings: false
            }
        })
    );
} else {
    config.devtool = 'sourcemap';
}

export default config;
