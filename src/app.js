import PIXI from 'pixi.js';

import Twitte from './twitte';

class App {
    constructor() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.matrixRow = 5;
        this.matrixColumn = 10;
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
            this.width, this.height,
            {antialias: true, transparent: true, resolution: 1}
        );

        document.body.appendChild(this.renderer.view);
        this.addTwitte();
        this.gameLoop();
    }

    addTwitte() {
        let props = {
            height: 214,
            width: 264,
            x: this.gameMatrix.length % this.matrixColumn,
            y: this.gameMatrix.length % this.matrixRow,
            vx: 0,
            vy: 0
        };
        let twitte = new Twitte(props, this.stage, this.resources);
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
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer.resize(this.width, this.height);
    }

    addListeners() {
        window.addEventListener('resize', ::this.onResize);
    }
}

export default App;