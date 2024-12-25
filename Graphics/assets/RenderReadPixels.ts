import { _decorator, Component, Node, RenderTexture } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RenderReadPixels')
export class RenderReadPixels extends Component {
    @property(RenderTexture)
    public renderTexture: RenderTexture;
    start() {
        const width = this.renderTexture.width;
        const height = this.renderTexture.height;
        const texPixels = new Uint8Array(width * height * 4);
        this.renderTexture.readPixels(0,0,
            this.renderTexture.width, this.renderTexture.height,
            texPixels
        );        
    }

    update(deltaTime: number) {
        
    }
}


