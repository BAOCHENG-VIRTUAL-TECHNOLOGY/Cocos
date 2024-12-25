import { _decorator, Camera, Component, Node, RenderTexture, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CaptureToWeb')
export class CaptureToWeb extends Component {
    @property(Sprite)
    sprite: Sprite = null;
    @property(Camera)
    camera: Camera = null;
    protected _renderTex: RenderTexture = null;
    start() {
        const sp = new SpriteFrame();
        const renderTex = this._renderTex = new RenderTexture();
        renderTex.reset({
            width: 256,
            height: 256,
        });
        this.camera.targetTexture = renderTex;
        sp.texture = renderTex;
        this.sprite.spriteFrame = sp;
    }

    update(deltaTime: number) {
        
    }
}


