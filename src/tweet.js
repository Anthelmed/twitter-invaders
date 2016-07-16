import PIXI from 'pixi.js';

class Tweet {
    constructor(props, tweet, stage, loader, resources) {

        this.props = props;
        this.stage= stage;
        this.tweet = tweet;
        this.loader = loader;
        this.resources = resources;

        this.mask = null;
        this.sprite = null;

        this.initSprite();

        this.vx = this.props.vx;
        this.vy = this.props.vy;
    }

    initSprite() {
        let imageName = 'image-' + this.props.id;
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

                this.mask.width = this.props.width;
                this.mask.height = this.props.height;
                this.mask.x = this.props.x;
                this.mask.y = this.props.y;
                this.sprite.width = this.props.width;
                this.sprite.height = this.props.height;
                this.sprite.x = this.props.x;
                this.sprite.y = this.props.y;

                this.stage.addChild(this.mask);
                this.sprite.mask = this.mask;
                this.stage.addChild(this.sprite);
            });
    }

    moveSprite() {
        this.sprite.x += this.vx;
        this.sprite.y += this.vy;
    }
}

export default Tweet