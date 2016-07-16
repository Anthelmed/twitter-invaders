/*eslint-env node*/
import express from 'express';
import Twit from 'twit';
import http from 'http';
import tracks from './config/tracks.json';
import twitterApi from './config/twitter-api.json';
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
    consumer_key:         twitterApi.consumer_key,
    consumer_secret:      twitterApi.consumer_secret,
    access_token:         twitterApi.access_token,
    access_token_secret:  twitterApi.access_token_secret,
    timeout_ms:           60*1000  // optional HTTP request timeout to apply to all requests.
});

//Stream using twitter tracks and Socket io
let trackList = tracks.map(function(item) {
    return item['track'];
});
let stream = T.stream('statuses/filter', { track: trackList });

io.on('connection', (socket) => {
    stream.on('tweet', function (tweet) {
        socket.emit('tweet', tweet);
    });
});

server.listen(3000);

app.use(history());

//Webpack
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
