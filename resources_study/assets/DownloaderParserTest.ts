import { _decorator, Component, Node, assetManager } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DownloaderParserTest')
export class DownloaderParserTest extends Component {
    start() {
        assetManager.downloader.maxRetryCount = 0;
        assetManager.downloader.retryInterval = 4000;
        assetManager.downloader.maxConcurrency = 10;
        assetManager.downloader.maxRequestsPerFrame = 6;
        // // main.js
        // assetManager.init({ 
        //     bundleVers: settings.bundleVers,
        //     remoteBundles: settings.remoteBundles,
        //     server: settings.server,
        //     jsbDownloaderMaxTasks: 32, // 最大并发数
        //     jsbDownloaderTimeout: 60 // 超时时长
        // });
        // assetManager.loadAny({'path':'test'},{priority:2, maxRetryCount:1, maxConcurrency: 10}, callback);
        let preset = assetManager.presets.preload;
        preset.priority = 1;
        assetManager.presets.mypreset = {maxConcurrency:10, maxRequestsPerFrame: 6};
        // assetManager.loadAny({'path':'test'},{preset:'mypreset'}, callback);
        assetManager.downloader.register('.myformat',function(url, options, callback){
            
        })
        assetManager.parser.register('.myformat',function(file,options,callback){});
    }

    update(deltaTime: number) {
        
    }
}


