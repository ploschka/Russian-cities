const Encore = require('@symfony/webpack-encore')
const PugPlugin = require('pug-plugin');

if (!Encore.isRuntimeEnvironmentConfigured())
{
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    .setOutputPath('public/build/')
    .setPublicPath('/build/')
    .addEntry('index', './src/templates/pages/index.pug')
    .addEntry('table', './src/templates/pages/table.pug')
    .addEntry('moscow', './src/templates/pages/moscow.pug')
    // .splitEntryChunks()
    .cleanupOutputBeforeBuild()
    .configureBabel((config) => {
        config.plugins.push('@babel/plugin-proposal-class-properties');
    })
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = 3;
    })
    .enableSingleRuntimeChunk()
    // .enableSassLoader()
    .addPlugin(new PugPlugin())
    .addLoader({test: /\.pug/, loader: PugPlugin.loader})
    .addLoader({test: /\.(css|sass|scss)$/, use: ['css-loader', 'sass-loader']})
;

module.exports = Encore.getWebpackConfig();
