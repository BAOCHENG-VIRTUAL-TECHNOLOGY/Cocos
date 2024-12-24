import { _decorator, Component, Node, assetManager, Prefab, instantiate, director, Texture2D, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BundleTest')
export class BundleTest extends Component {
    start() {
        // assetManager.loadBundle('01_graphics',(err,bundle)=>{
        //     bundle.load('xxx');
        // })
        // assetManager.loadBundle('https：//othergame.com/remote/01_graphics',(err,bundle)=>{
        //     bundle.load('xxx');
        // })
        // assetManager.loadBundle(jsb.fileUtils.getWritablePath()+'/pathToBundle/bundleName',(err,bundle)=>{

        // });
        // assetManager.loadBundle(wx.env.USER_DATA_PATH+'/pathToBundle/bundleName',(err,bundle)=>{

        // });
        assetManager.loadBundle('01_graphics',{version:'fbc07'},function(err,bundle){
            if(err){
                return console.error(err);
            }
            console.log('load bundle successfully.');
            bundle.load('prefab', Prefab,function(err,prefab){
                let newNode = instantiate(prefab);
                director.getScene().addChild(newNode);
            })
            bundle.load('image/texture',Texture2D,function(err,texture){
                console.log(texture)
            })
            bundle.load('image/spriteFrame',SpriteFrame,function(err,spriteFrame){
                console.log(spriteFrame);
            })
            bundle.loadDir("textures",function(err,texture){

            })
            bundle.loadDir("textures",Texture2D,function(err,assets){

            })
            bundle.loadScene("test",function(err,scene){
                director.runScene(scene);
            })
        });
        // let bundle = assetManager.getBundle('01_graphics');
        // bundle.load('image/spriteFrame',SpriteFrame,function(err,spriteFrame){
        //     assetManager.releaseAsset(spriteFrame);
        // })
        // bundle.load('image/spriteFrame',SpriteFrame,function(err,spriteFrame){
        //     bundle.release('image',SpriteFrame);
        // })
        // bundle.load('image/spriteFrame',SpriteFrame,function(err,spriteFrame){
        //     bundle.releaseAll();
        // })
        let bundle = assetManager.getBundle('bundle1');
        assetManager.removeBundle(bundle);
        bundle.release('image',SpriteFrame);
        assetManager.removeBundle(bundle);
        bundle.releaseAll();
        assetManager.removeBundle(bundle);
    }

    update(deltaTime: number) {
        
    }
}


