/*eslint-env node*/
import express from 'express';
import Twit from 'twit';
import http from 'http';
import webpack from 'webpack';
import history from 'connect-history-api-fallback';
import portNumber from 'port-number';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import devConfig from './webpack/webpack.dev.config.babel.js';

const env = process.env.NODE_ENV;
const isDeveloping = env !== 'production';
const port = isDeveloping ? 9000 : process.env.PORT;
const ip = '127.0.0.1';

const app = express();

//Socket io
const server = new http.Server(app);
const io = require('socket.io')(server);

//Twitter Api
const T = new Twit({
    consumer_key:         'efrF4jmviXP13UdR0FhroUw9u',
    consumer_secret:      'E1gwGuEcB1AyDc5WkowXpH3LSiAFxHGpB18y4t0tDU7C5nnSJu',
    access_token:         '725371147324391429-iuVmH8ok7idKYYGEGhs2dW0mOXTNbYb',
    access_token_secret:  'Sb13X2FiHCBTjwx8UC6yfzhWTxXZyypxkfm8Fdea8WvV9',
    timeout_ms:           60*1000  // optional HTTP request timeout to apply to all requests.
});

//Stream using twitter tracks and Socket io
var stream = T.stream('statuses/filter', { track: '#apple' });

io.on('connection', (socket) => {
    stream.on('tweet', function (tweet) {
        socket.emit('tweet', tweet);
    });
});

server.listen(3000);

app.use( history() );

if( isDeveloping ) {

    const compiler = webpack( devConfig );

    app.use( webpackDevMiddleware( compiler, {
        publicPath: devConfig.output.publicPath,
        headers: { 'Access-Control-Allow-Origin': '*' },
        hot: false,
        noInfo: true,
        quiet: false,
        proxy: { '*': 'http://127.0.0.1:3000' },
        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false
        }
    }) );

    app.use( webpackHotMiddleware( compiler ) );

    // Serve pure static assets
    app.use( express.static( './static' ) );

} else {

    app.use( express.static( __dirname + '/dist' ) );
}

app.listen( port, ip, error => {
    if ( error ) throw error;

    /*eslint-disable no-console */
    console.info( `[${env}] Listening on port ${port}. Open up http://${ip}:${port}/ in your browser.` );
    /*eslint-enable no-console */
});
