import PIXI from 'pixi.js';

class Twitte {
    constructor(props, tweet, stage, resources) {
        //Init Sprite
        this.sprite = new PIXI.Sprite(
            resources.twitte.texture
        );

        //Sprite properties
        this.sprite.width = props.width;
        this.sprite.height = props.height;
        this.sprite.x = props.x;
        this.sprite.y = props.y;

        this.tweet = tweet;
        console.log(this.tweet);
        console.log(this.sprite.x,this.sprite.y);
        this.vx = props.vx;
        this.vy = props.vy;

        stage.addChild(this.sprite);
    }

    move() {
        this.sprite.x += this.vx;
        this.sprite.y += this.vy;
    }
}

export default Twitte