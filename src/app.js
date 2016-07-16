import PIXI from 'pixi.js';
import io from 'socket.io-client';

import Tweet from './tweet';
import { getSize, getPosition } from '../utils/tweet-utils';

class App {
    constructor() {
        this.socket = io.connect('127.0.0.1:3000', { reconnect: true });

        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;

        this.matrixRow = 5;
        this.matrixColumn = 10;
        this.tweetSize = getSize(this.windowWidth, 214, 264, this.matrixColumn);
        this.matrixGutter = this.tweetSize.width / this.matrixColumn;
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
            .on("progress", this.loadProgressHandler)
            .load(::this.initGame);
    }

    loadProgressHandler() {
        console.log("loading");
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

    addTweet(tweet) {
        let position = getPosition(this.gameMatrix, this.matrixColumn, this.tweetSize.width, this.tweetSize.height, this.matrixGutter);

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

    gameLoop() {
        requestAnimationFrame(::this.gameLoop);

        this.renderer.render(this.stage);
    }

    //////////
    //Listeners
    //////////
    onResize() {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.renderer.resize(this.windowWidth, this.windowHeight);
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