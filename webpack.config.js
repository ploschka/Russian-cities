const Encore = require('@symfony/webpack-encore')
const PugPlugin = require('pug-plugin');
const path = require('path');

if (!Encore.isRuntimeEnvironmentConfigured())
{
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    .setOutputPath('public/build/')
    .setPublicPath('/build/')
    .addEntry('index', './src/templates/pages/index.pug')
    .addEntry('table', './src/templates/pages/table.pug')
    .addAliases({
        Images: path.join(__dirname, './src/images'),
        Styles: path.join(__dirname, './src/styles'),
        Scripts: path.join(__dirname, './src/script')
    })

    .addEntry('chelyabinsk', './src/templates/pages/cities/chelyabinsk.pug')
    .addEntry('ekaterinburg', './src/templates/pages/cities/ekaterinburg.pug')
    .addEntry('kazan', './src/templates/pages/cities/kazan.pug')
    .addEntry('khabarovsk', './src/templates/pages/cities/khabarovsk.pug')
    .addEntry('moscow', './src/templates/pages/cities/moscow.pug')
    .addEntry('nizhni-novgorod', './src/templates/pages/cities/nizhni-novgorod.pug')
    .addEntry('novosibirsk', './src/templates/pages/cities/novosibirsk.pug')
    .addEntry('piter', './src/templates/pages/cities/piter.pug')
    .addEntry('rostov-na-donu', './src/templates/pages/cities/rostov-na-donu.pug')
    .addEntry('saratov', './src/templates/pages/cities/saratov.pug')
    .addEntry('simferopol', './src/templates/pages/cities/simferopol.pug')
    .addEntry('sochi', './src/templates/pages/cities/sochi.pug')
    .addEntry('syzran', './src/templates/pages/cities/syzran.pug')
    .addEntry('voronezh', './src/templates/pages/cities/voronezh.pug')

    .cleanupOutputBeforeBuild()
    .configureBabel((config) => {
        config.plugins.push('@babel/plugin-proposal-class-properties');
    })
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = 3;
    })
    .enableSingleRuntimeChunk()
    .addPlugin(new PugPlugin({
        js: {
            // output filename of extracted JS file from source script
            filename: 'assets/js/[name].[contenthash:8].js',
          },
        css: {
        // output filename of extracted CSS file from source style
            filename: 'assets/css/[name].[contenthash:8].css'
        }
    }))
    .addLoader({test: /\.pug/, loader: PugPlugin.loader})
    .addLoader({test: /\.(css|sass|scss)$/, use: ['css-loader', 'sass-loader']})
;

module.exports = Encore.getWebpackConfig();
