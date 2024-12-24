import { _decorator, Component, Node, SpriteFrame, loader, assetManager } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SubpackageUpgradeTest')
export class SubpackageUpgradeTest extends Component {
    start() {
        // loader.downloader.loadSubpackage('sub1',(err)=>{
        //     loader.loadRes('sub1/sprite-frames/background',SpriteFrame);
        // })
        assetManager.loadBundle('sub1',(err,bundle)=>{
            bundle.load('sprite-frames/background',SpriteFrame);})
    }

    update(deltaTime: number) {
        
    }
}


