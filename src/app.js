import PIXI from 'pixi.js';
import io from 'socket.io-client';

import Tweet from './tweet';
import { getSize, getPosition } from '../utils/tweet-utils';

const pointsByTweet = 10;

class App {
    constructor() {
        this.socket = io.connect('127.0.0.1:3000', { reconnect: true });

        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.margin = window.innerWidth * 0.2;

        this.score = 0;
        this.tweetSize = getSize(this.windowWidth, 214, 264);
        this.matrixGutter = this.tweetSize.width / 4;
        this.gameMatrix = [];
        this.explosions = [];

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
        let position = getPosition(this.windowWidth, this.margin, this.gameMatrix.length, this.tweetSize.width, this.tweetSize.height, this.matrixGutter);

        let props = {
            id: this.gameMatrix.length + 1,
            width: this.tweetSize.width,
            height: this.tweetSize.height,
            x: position.x,
            y: position.y,
            vx: 0,
            vy: 0
        };
        let newTweet = new Tweet(props, tweet, this.stage, this.loader, this.resources, this.explosions);
        this.gameMatrix.push(newTweet);
    }

    resetTweetProperties() {
        this.tweetSize = getSize(this.windowWidth, 214, 264);
        this.matrixGutter = this.tweetSize.width / 4;

        for (let m = 0; m < this.gameMatrix.length; m++) {
            let tweet = this.gameMatrix[m];
            let position = getPosition(this.windowWidth, this.margin, m, this.tweetSize.width, this.tweetSize.height, this.matrixGutter);

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

        for (let m = 0; m < this.gameMatrix.length; m++) {
            let tweet = this.gameMatrix[m];

            if(!tweet.alive) {
                this.gameMatrix.splice(m, 1);
                this.resetTweetProperties();
                this.updateScore();
            } else {
                tweet.update();
            }

        }

        for(let explosion of this.explosions) {
            explosion.update();
        }

        this.renderer.render(this.stage);
        this.renderer.render(this.stage);
    }

    updateScore() {
        this.score += pointsByTweet;

        document.querySelector('h2 .points').innerHTML = this.score;
    }

    //////////
    //Listeners
    //////////
    onResize() {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.renderer.resize(this.windowWidth, this.windowHeight);
        this.resetTweetProperties();
    }

    addListeners() {
        window.addEventListener('resize', ::this.onResize);
        this.onTweet();
    }

    onTweet() {
        this.socket.on('tweet', (tweet) => {
            this.addTweet(tweet);
        });
    }
}

export default App;