import PIXI from 'pixi.js';
import io from 'socket.io-client';

import Tweet from './tweet';
import { getSize, getPosition } from '../utils/tweet-utils';

class App {
    constructor() {
        this.socket = io.connect('127.0.0.1:3000', { reconnect: true });

        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;

        this.matrixRow = 3;
        this.matrixColumn = 5;
        this.tweetSize = getSize(this.windowWidth, 214, 264, this.matrixColumn);
        this.matrixGutter = this.tweetSize.width / (this.matrixColumn - 2);
        this.gameMatrix = [];

        //Alias
        this.loader = PIXI.loader;
        this.resources = PIXI.loader.resources;
        this.stage = null;
        this.renderer = null;

        this.loadAssets();
        this.addListeners();
    }

    //////////
    //Loader
    //////////
    loadAssets() {
        this.loader
            .add('mask', 'assets/images/twitter-logo.png')
            .load(::this.initGame);
    }

    //////////
    //Init
    //////////
    initGame() {
        this.stage = new PIXI.Container();
        this.renderer = new PIXI.WebGLRenderer(
            this.windowWidth, this.windowHeight,
            {antialias: true, transparent: true}
        );

        document.body.appendChild(this.renderer.view);
        this.gameLoop();
    }

    //////////
    //Tweets function
    //////////
    addTweet(tweet) {
        let position = getPosition(this.gameMatrix.length, this.matrixColumn, this.tweetSize.width, this.tweetSize.height, this.matrixGutter);

        let props = {
            id: this.gameMatrix.length + 1,
            width: this.tweetSize.width,
            height: this.tweetSize.height,
            x: position.x,
            y: position.y,
            vx: 0,
            vy: 0
        };
        let newTweet = new Tweet(props, tweet, this.stage, this.loader, this.resources);
        this.gameMatrix.push(newTweet);
    }

    resizeTweet() {
        this.tweetSize = getSize(this.windowWidth, 214, 264, this.matrixColumn);
        this.matrixGutter = this.tweetSize.width / (this.matrixColumn - 2);

        for (let m = 0; m < this.gameMatrix.length; m++) {
            let tweet = this.gameMatrix[m];
            let position = getPosition(m, this.matrixColumn, this.tweetSize.width, this.tweetSize.height, this.matrixGutter);

            tweet.width = this.tweetSize.width;
            tweet.height = this.tweetSize.height;
            tweet.x = position.x;
            tweet.y = position.y;

            tweet.resize();
        }
    }

    //////////
    //Mechanics
    //////////
    gameLoop() {
        requestAnimationFrame(::this.gameLoop);

        this.renderer.render(this.stage);
        this.renderer.render(this.stage);
    }

    //////////
    //Listeners
    //////////
    onResize() {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.renderer.resize(this.windowWidth, this.windowHeight);
        this.resizeTweet();
    }

    addListeners() {
        window.addEventListener('resize', ::this.onResize);
        this.onTweet();
    }

    onTweet() {
        this.socket.on('tweet', (tweet) => {
            if (this.gameMatrix.length < this.matrixRow * this.matrixColumn)
                this.addTweet(tweet);
        });
    }
}

export default App;