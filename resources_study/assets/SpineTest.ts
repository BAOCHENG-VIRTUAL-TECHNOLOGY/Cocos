import { _decorator, Component, Node, sp, assetManager, ImageAsset, Texture2D} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpineTest')
export class SpineTest extends Component {
    start() {
        // let comp = this.getComponent('sp.Skeleton') as sp.Skeleton;
        // let image = "http://localhost/download/spineres/1/1.png";
        // let ske = "http://localhost/download/spineres/1/1.json";
        // let atlas = "http://localhost/download/spineres/1/1.atlas";
        // assetManager.loadAny([{url:atlas, ext:'.txt'},{url:ske, ext:'.txt'}],(error, assets)=>{
        //     assetManager.loadRemote(image,(error,img:ImageAsset)=>{
        //         let texture = new Texture2D();
        //         texture.image = img;
                // asset.skeletonJson = assets[1];
                // asset.atlasText = assets[0];
                // asset.textures = [texture];
                // asset.textureNames = ['1.png'];
                // skeleton.skeletonData = asset;
            // })
        // })

        let comp = this.getComponent('sp.Skeleton') as sp.Skeleton;
        let image = "http://localhost/download/spineres/1/1.png";
        let ske = "http://localhost/download/spineres/1/1.json";
        let atlas = "http://localhost/download/spineres/1/1.atlas";
        assetManager.loadAny([{url:atlas, ext:'.txt'},{url:ske, ext:'.bin'}],(error, assets)=>{
            assetManager.loadRemote(image,(error,texture:Texture2D)=>{
                let asset = new sp.SkeletonData();
                asset._nativeAsset = assets[1];
                asset.atlasText = assets[0];
                asset.textures = [texture];
                asset.textureNames = ['1.png'];
                asset._uuid = ske;//可以传入任意字符串，但不能为空
                asset._nativeUrl = ske;//传入一个二进制路径用作initSkeleton时的filePath参数使用
                comp.skeletonData = asset;
                let ani = comp.setAnimation(0,'walk',true);
            })
        })
    }

    update(deltaTime: number) {
        
    }
}


