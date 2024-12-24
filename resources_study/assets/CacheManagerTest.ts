import { _decorator, Component, Node, resources, Texture2D, assetManager} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CacheManagerTest')
export class CacheManagerTest extends Component {
    start() {
        resources.load('images/background/texture',Texture2D,function(err,texture){
            const cachePath = assetManager.cacheManager.getCache(texture.nativeUrl);
            console.log(cachePath);
        });
        assetManager.loadRemote('http://example.com/background.jpg',function(err,texture){
            const tempPath = assetManager.cacheManager.getTemp(texture.nativeUrl);
            console.log(tempPath);
        });
        // assetManager.loadRemote('http://example.com/background.jpg', {cacheEnabled:  true}, callback);
        assetManager.loadRemote('http://example.com/background.jpg',function(err,texture){
            assetManager.cacheManager.removeCache(texture.nativeUrl);
        })
    }

    update(deltaTime: number) {
        
    }
}


