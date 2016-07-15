import PIXI from 'pixi.js';

class Twitte {
    constructor(props, stage, resources) {
        //Init sprite
        this.twitte = new PIXI.Sprite(
            resources.twitte.texture
        );

        //Sprite properties
        this.twitte.width = props.width;
        this.twitte.height = props.height;
        this.twitte.x = props.x;
        this.twitte.y = props.y;
        this.twitte.x = 0.5;
        this.twitte.y = 0.5;

        this.vx = props.vx;
        this.vy = props.vy;

        stage.addChild(this.twitte);
    }

    move() {
        this.twitte.x += this.vx;
        this.twitte.y += this.vy;
    }
}

export default Twitte