import { _decorator, Component, SpriteFrame, resources, Node, Sprite, assetManager, Prefab, Texture2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AssetManagerTest')
export class AssetManagerTest extends Component {
    start() {
        // resources.load("images/background/spriteFrame",SpriteFrame,(err,asset)=>{
        //     this.getComponent(Sprite).spriteFrame = asset;
        // })
        // resources.preload("images/background/spriteFrame",SpriteFrame);
        // setTimeout(this.loadAsset.bind(this),10000);
        // assetManager.loadBundle('testBundle',function(err,bundle){
        //     bundle.load('textures/background',(err,asset)=>{
        //         //...
        //     });
        // })
        // resources.load('prefabs/enemy',Prefab,function(err,asset){
        //     assetManager.releaseAsset(asset);
        // });
        // resources.load('textures/armor/texture',Texture2D,(err,texture)=>{
        //     texture.addRef();
        //     this.texture=texture;
        // })
        // this.texture.decRef();
        // this.texture=null;
    }

    // loadAsset(){
    //     resources.load('images/background/spriteFrame',SpriteFrame,(err,asset)=>{
    //         this.getComponent(Sprite).spriteFrame = asset;
    //     })
    // }
    update(deltaTime: number) {
        
    }
}


