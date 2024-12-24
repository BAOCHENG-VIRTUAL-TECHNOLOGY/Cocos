// import { _decorator, Component, Node, AssetMananger, assetManager } from 'cc';
// const { ccclass, property } = _decorator;

// @ccclass('AssetManangerOptionsTest')
// export class AssetManangerOptionsTest extends Component {
//     start() {
//         //扩展管线
//         AssetMananger.pipeline.insert(function (task, done) {
//             const input = task.input;
//             for(let i=0;i<input.length;i++){
//                 if(input[i].options.myParam === 'important'){
//                     console.log(input[i].url);
//                 }
//             }
//             task.output = task.input;
//             done();
//         },1);
//         assetManager.loadAny({'path':'images/background'},{'myParam':'important'}, callback);
//         assetManager.downloader.register('.myformat',function(url, options, callback){
//             const img = new Image();
//             if(options.isCrossOrigin){
//                 img.crossOrigin = 'anonymous';
//             }
//             img.onload = function(){
//                 callback(null, img);
//             }
//             img.onerror = function(){
//                 callback(new Error('download failed'), null);
//             };

//             img.src=url;
//         });
//         assetManager.parser.register('.myformat',function(file, options, callback){
//             callback(null, file);
//         });
//         assetManager.loadAny({'url':'http://example.com/myAsset.myformat'},{isCrossOrigin:true},callback);
//     }

//     update(deltaTime: number) {
        
//     }
// }


