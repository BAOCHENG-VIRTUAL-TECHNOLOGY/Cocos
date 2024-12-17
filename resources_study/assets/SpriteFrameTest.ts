import { _decorator, Component, ImageAsset, Texture2D, Node, resources, SpriteFrame, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpriteFrameTest')
export class SpriteFrameTest extends Component {
    start() {
        const url = "test_assets/test_atlas/content/spriteFrame";
        resources.load(url, SpriteFrame,(err:any, spriteFrame)=>{
            const sprite = this.getComponent(Sprite);
            sprite.spriteFrame = spriteFrame;
        })

        const self = this;
        const url1 = 'test_assets/test_atlas/content';
        resources.load(url, ImageAsset, (err:any, imageAsset)=>{
            const sprite = this.getComponent(Sprite);
            sprite.spriteFrame = SpriteFrame.createWithImage(imageAsset);
        })

        resources.load(url1, ImageAsset, (err:any, imageAsset)=>{
            const sprite = this.getComponent(Sprite);
            const spriteFrame = new SpriteFrame();
            const tex = new Texture2D();
            tex.image = imageAsset;
            spriteFrame.texture = tex;
            sprite.spriteFrame = spriteFrame;
        })

        // const sprite = this.getComponent(Sprite);
        // sprite.spriteFrame = SpriteFrame.createWithImage(canvas);
    
        // const sprite = this.getComponent(Sprite);
        // const img = new ImageAsset(canvas);
        // const tex = new Texture2D();
        // tex.image = img;
        // const sp = new SpriteFrame();
        // sp.texture = tex;
        // sprite.spriteFrame = sp;
    }

    update(deltaTime: number) {
        
    }
}


