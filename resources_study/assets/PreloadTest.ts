import { _decorator, Component, Node, resources, SpriteFrame, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PreloadTest')
export class PreloadTest extends Component {
    start() {
        resources.preloadDir('images/background/spriteFrame', SpriteFrame);
        resources.load('iamges/background/spriteFrame', SpriteFrame, function(err, spriteFrame){
            spriteFrame.addRef();
            // self.getComponent(Sprite).spriteFrame = spriteFrame;
        })
    }

    update(deltaTime: number) {
        
    }
}


