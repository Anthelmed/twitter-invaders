import PIXI from 'pixi.js';

import Text from './text';

import { randomIntFromInterval, map } from '../utils/math-utils';

class Tweet {
    constructor(props, tweet, stage, loader, resources, explosions) {
        this.stage = stage;
        this.tweet = tweet;
        this.loader = loader;
        this.resources = resources;
        this.explosions = explosions;

        this.mask = null;
        this.mask = null;
        this.sprite = null;

        this.exploding = false;
        this.lives = randomIntFromInterval(10,100);
        this.width = props.width;
        this.height = props.height;
        this.x = props.x;
        this.y = props.y;

        ::this.initSprite();

        this.vx = props.vx;
        this.vy = props.vy;
    }

    //////////
    //Init
    //////////
    initSprite() {
        let maskName = 'mask-' + randomIntFromInterval(1,15);
        let imageName = 'image-' + Object.keys(this.resources).length + 1;
        let path = this.tweet.user.profile_image_url;

        this.mask = new PIXI.Sprite(
            this.resources[maskName].texture
        );

        this.loader
            .add(imageName ,path)
            .load(() => {
                this.sprite = new PIXI.Sprite(
                    this.resources[imageName].texture
                );

                this.resize();
                this.sprite.interactive = true;
                this.addListeners();

                this.stage.addChild(this.mask);
                this.sprite.mask = this.mask;
                this.stage.addChild(this.sprite);
            });
    }

    //////////
    //Mechanics
    //////////
    update() {
        if(this.mask && this.sprite) {
            this.mask.x += this.vx;
            this.mask.y += this.vy;
            this.sprite.x += this.vx;
            this.sprite.y += this.vy;
        }

        if(this.exploding) {
            this.lives -= 1;
            this.sprite.alpha = map(this.lives, 10, 100, 0, 1);
            if(this.lives <= 0) {
                this.stage.removeChild(this.mask);
                this.stage.removeChild(this.sprite);
            }
        }
    }

    resize() {
        if(this.mask && this.sprite) {
            this.mask.width = this.width;
            this.mask.height = this.height;
            this.mask.x = this.x;
            this.mask.y = this.y;
            this.sprite.width = this.width;
            this.sprite.height = this.height;
            this.sprite.x = this.x;
            this.sprite.y = this.y;
        }
    }

    explode() {
        if(!this.exploding) {
            this.exploding = true;
        
            this.generateWords();
            this.playKilledSound();
        }
    }

    generateWords() {
        let words = this.tweet.text.split(' ');
        let colorIndex = randomIntFromInterval(0,15);
        
        for (let word of words) {
            let props = {
                word: word,
                colorIndex: colorIndex,
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
            };

            this.explosions.push(new Text(props, this.stage));
        }
    }

    playKilledSound() {
        let audioElement = document.createElement('audio');

        audioElement.setAttribute('src', 'assets/audios/tweetKilled.mp3');
        audioElement.play();

        setTimeout(() => {
            audioElement.remove();
        }, audioElement.duration);
    }

    //////////
    //Listeners
    //////////
    addListeners() {
        this.sprite.on('mousedown', ::this.explode);
    }
}

export default Tweet