import { _decorator, Component, Node, resources, Texture2D, assetManager, Sprite, SpriteFrame} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ReleaseManagerTest')
export class ReleaseManagerTest extends Component {
    start() {
        resources.load('images/background',Texture2D, (err, texture) => {
            this.texture = texture;
            texture.addRef();
        });
        assetManager.releaseAsset(texture);
        resources.load('images/background/spriteFrame', SpriteFrame, function(err, spriteFrame){
            self.getComponent(Sprite).spriteFrame = spriteFrame;
        })
        resources.load('images/background/spriteFrame', SpriteFrame, function(err, spriteFrame){
            self.getComponent(Sprite).spriteFrame = spriteFrame;
            spriteFrame.addRef();
        })
        this.spriteFrame.decRef();
        this.spriteFrame = null;
    }

    onDestroy(){
        this.texture.decRef();
    }
    update(deltaTime: number) {
        
    }
}


