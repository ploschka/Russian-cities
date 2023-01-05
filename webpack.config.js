const Encore = require('@symfony/webpack-encore')
const PugPlugin = require('pug-plugin');

if (!Encore.isRuntimeEnvironmentConfigured())
{
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    .setOutputPath('dist/build/')
    .setPublicPath('/build/')
    .addEntry('index', './src/templates/pages/index.pug')
    .addEntry('table', './src/templates/pages/table.pug')
    .addEntry('moscow', './src/templates/pages/moscow.pug')
    .splitEntryChunks()
    .cleanupOutputBeforeBuild()
    .enableSingleRuntimeChunk()
    .enableSassLoader()
    .addPlugin(new PugPlugin())
    .addLoader({test: /\.pug/, loader: PugPlugin.loader})
;

module.exports = Encore.getWebpackConfig();
