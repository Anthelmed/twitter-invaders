import PIXI from 'pixi.js';

class Tweet {
    constructor(props, tweet, stage, loader, resources) {
        this.stage = stage;
        this.tweet = tweet;
        this.loader = loader;
        this.resources = resources;

        this.id = props.id;
        this.alive = true;
        this.width = props.width;
        this.height = props.height;
        this.x = props.x;
        this.y = props.y;

        this.mask = null;
        this.sprite = null;

        ::this.initSprite();

        this.vx = props.vx;
        this.vy = props.vy;
    }

    //////////
    //Init
    //////////
    initSprite() {
        let imageName = 'image-' + Object.keys(this.resources).length + 1;
        let path = this.tweet.user.profile_image_url;

        this.mask = new PIXI.Sprite(
            this.resources.mask.texture
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
    move() {
        this.sprite.x += this.vx;
        this.sprite.y += this.vy;
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

    }

    //////////
    //Listeners
    //////////
    handleClick() {
        this.explode();
        setTimeout(() => {
            this.alive = false;
            this.stage.removeChild(this.mask);
            this.stage.removeChild(this.sprite);
        }, 500);
    }

    addListeners() {
        this.sprite.on('mousedown', ::this.handleClick);
    }
}

export default Tweet