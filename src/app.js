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
        this.margin = window.innerWidth * 0.25;

        this.score = 0;
        this.direction = 'right';
        this.tweetSize = getSize(this.windowWidth, 500, 300);
        this.matrixGutter = this.tweetSize.width / 6;
        this.gameMatrix = [];
        this.explosions = [];

        //Alias
        this.loader = PIXI.loader;
        this.resources = PIXI.loader.resources;
        this.stage = null;
        this.renderer = null;

        this.loadAssets();
    }

    //////////
    //Loader
    //////////
    loadAssets() {
        this.loader
            .add('mask-1', 'assets/images/mask-1.png')
            .add('mask-2', 'assets/images/mask-2.png')
            .add('mask-3', 'assets/images/mask-3.png')
            .add('mask-4', 'assets/images/mask-4.png')
            .add('mask-5', 'assets/images/mask-5.png')
            .add('mask-6', 'assets/images/mask-6.png')
            .add('mask-7', 'assets/images/mask-7.png')
            .add('mask-8', 'assets/images/mask-8.png')
            .add('mask-9', 'assets/images/mask-9.png')
            .add('mask-10', 'assets/images/mask-10.png')
            .add('mask-11', 'assets/images/mask-11.png')
            .add('mask-12', 'assets/images/mask-12.png')
            .add('mask-13', 'assets/images/mask-13.png')
            .add('mask-14', 'assets/images/mask-14.png')
            .add('mask-15', 'assets/images/mask-15.png')
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
        this.addListeners();
    }

    //////////
    //Tweets function
    //////////
    addTweet(tweet) {
        let position = getPosition(this.windowWidth, this.margin, this.gameMatrix.length, this.tweetSize.width, this.tweetSize.height, this.matrixGutter);

        let props = {
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
        this.direction = (new Date().getSeconds() < 30) ? 'right' : 'left';

        if(this.direction == 'right') {
            this.stage.x += 0.1;
        } else {
            this.stage.x -= 0.1;
        }

        for (let m = 0; m < this.gameMatrix.length; m++) {
            let tweet = this.gameMatrix[m];

            if(tweet.lives <= 0) {
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
        this.margin = window.innerWidth * 0.25;
        this.tweetSize = getSize(this.windowWidth, 500, 300);
        this.matrixGutter = this.tweetSize.width / 6;

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