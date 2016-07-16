import PIXI from 'pixi.js';

import { randomIntFromInterval, map } from '../utils/math-utils';

const colors = [0x1dbfd6,0x1dbfd6,0x1dbfd6,0x1dbfd6,0x1dbfd6,0x1dbfd6,0x1dbfd6,0x1dbfd6,0x1dbfd6,0x1dbfd6,0x1dbfd6,0x1dbfd6,0x1dbfd6,0x1dbfd6,0x1dbfd6,0x1dbfd6];

class Text {
    constructor(props, stage) {
        this.stage = stage;
        this.word = props.word;
        this.text = null;
        this.lives = props.lives;

        this.x = props.x;
        this.y = props.y;
        this.rotation = props.rotation;

        this.initText();

        this.vx = props.vx;
        this.vy = props.vy;

    }

    initText() {
        let index = randomIntFromInterval(0,colors.length-1);
        console.log(index);
        let color = colors[index];
        let fontSize = randomIntFromInterval(16,24);
        this.text = new PIXI.Text(this.word, {font: fontSize + 'px Arial', fill: color, align: 'center'});

        this.text.x = this.x;
        this.text.y = this.y;
        this.text.rotation = this.rotation;

        this.stage.addChild(this.text);
    }

    update() {
        this.text.x += this.vx;
        this.text.y += this.vy;
        this.lives -= 1;
        this.text.alpha = map(this.lives, 10, 100, 0, 1);

        if(this.lives <= 0) {
            this.stage.removeChild(this.text);
        }
    }
}

export default Text;