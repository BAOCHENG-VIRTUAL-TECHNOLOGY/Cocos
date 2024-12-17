import { _decorator, Component, Node, resources, Sprite, SpriteFrame, Texture2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TexturesTest')
export class TexturesTest extends Component {
    start() {
        
        resources.load("testAssets/image/texture", Texture2D, (err:any, texture:Texture2D)=>{
            const spriteFrame = new SpriteFrame();
            spriteFrame.texture = texture;
            // texture.setMipRange(minLevel, maxLevel);
            this.node.getComponent(Sprite).spriteFrame = spriteFrame;
        })
    }

    update(deltaTime: number) {
        
    }
}


