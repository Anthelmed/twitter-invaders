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
        this.mask.width = this.width;
        this.mask.height = this.height;
        this.mask.x = this.x;
        this.mask.y = this.y;
        this.sprite.width = this.width;
        this.sprite.height = this.height;
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }

    explode() {
        this.exploding = true;
        let words = this.tweet.text.split(' ');

        for (let word of words) {
            let props = {
                word: word,
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
            };

            this.explosions.push(new Text(props, this.stage));
        }
    }

    //////////
    //Listeners
    //////////
    handleClick() {
        this.explode();
    }

    addListeners() {
        this.sprite.on('mousedown', ::this.handleClick);
    }
}

export default Tweet