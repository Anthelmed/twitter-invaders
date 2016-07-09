import PIXI from 'pixi.js';

class App {
    constructor() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.renderer = PIXI.autoDetectRenderer(
            this.width, this.height,
            {antialias: true, transparent: true, resolution: 1}
        );
        document.body.appendChild(this.renderer.view);

        this.stage = new PIXI.Container();
        this.renderer.render(this.stage);

        this.addListeners();
    }

    onResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    addListeners() {
        window.addEventListener('resize', ::this.onResize);
    }
}

export default App;