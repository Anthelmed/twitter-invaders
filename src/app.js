import PIXI from 'pixi.js';
import io from 'socket.io-client';

import Twitte from './twitte';
import { getSize, getPosition } from '../utils/twitte-utils';

class App {
    constructor() {
        this.socket = io.connect('127.0.0.1:3000', { reconnect: true });

        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;

        this.matrixRow = 5;
        this.matrixColumn = 10;
        this.twitteSize = getSize(this.windowWidth, 214, 264, this.matrixColumn);
        this.matrixGutter = this.twitteSize.width / 4;
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
            .add('twitte', 'assets/images/twitter.png')
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
        this.renderer = PIXI.autoDetectRenderer(
            this.windowWidth, this.windowHeight,
            {antialias: true, transparent: true, resolution: 1}
        );

        document.body.appendChild(this.renderer.view);
        this.gameLoop();
    }

    addTwitte(tweet) {
        let position = getPosition(this.gameMatrix, this.matrixColumn, this.twitteSize.width, this.twitteSize.height, this.matrixGutter);

        let props = {
            width: this.twitteSize.width,
            height: this.twitteSize.height,
            x: position.x,
            y: position.y,
            vx: 0,
            vy: 0
        };
        let twitte = new Twitte(props, tweet, this.stage, this.resources);
        this.gameMatrix.push(twitte);
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
                this.addTwitte(tweet);
        });
    }
}

export default App;