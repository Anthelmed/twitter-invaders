import PIXI from 'pixi.js';

import { randomIntFromInterval, map } from '../utils/math-utils';

const colors = [
    0x1dbfd6,
    0x8dc73f,
    0xfcb815,
    0xb59562,
    0x78cf98,
    0x8e2895,
    0xf11d19,
    0x42af52,
    0xffdf00,
    0x0074b6,
    0xf30089,
    0xe7e7e7,
    0xf06426,
    0xbf245e,
    0x52318c,
    0x41998d];

class Text {
    constructor(props, stage) {
        this.stage = stage;
        this.word = props.word;
        this.color = colors[props.colorIndex];
        this.text = null;
        this.lives = randomIntFromInterval(10,100);

        this.x = props.x;
        this.y = props.y;
        this.rotation = randomIntFromInterval(0,360);

        this.initText();

        this.vx = randomIntFromInterval(0.1,1);
        this.vy = randomIntFromInterval(0.1,1);

    }

    initText() {
        let fontSize = randomIntFromInterval(16,24);
        this.text = new PIXI.Text(this.word, {font: fontSize + 'px Sarala', fill: this.color, align: 'center'});

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