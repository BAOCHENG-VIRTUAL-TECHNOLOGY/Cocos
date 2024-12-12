import { _decorator, Component, Node, VideoPlayer, find } from 'cc';
const { ccclass, property, type } = _decorator;

@ccclass('VideoPlayerScript')
export class VideoPlayerScript extends Component {
    // @type(VideoPlayer)
    // videoPlayer = null;
    // start() {
    //     const eventHandler = new Component.EventHandler();
    //     // eventHandler.target = newTarget;
    //     eventHandler.component = "VideoPlayerScript";
    //     eventHandler.handler = "callback";
    //     eventHandler.customEventData = "foobar";
    //     this.videoPlayer.videoPlayerEvent.push(eventHandler);
    // }

    // callback: function(videoplayer, eventType, customEventData){
    //     // 这里的 videoplayer 是一个 VideoPlayer 组件对象实例
    //     // 这里的 eventType === VideoPlayer.EventType enum 里面的值
    //     // 这里的 customEventData 参数就等于你之前设置的 "foobar"
    // }
    // @type(VideoPlayer)
    // videoPlayer = null;
    // start(){
    //     this.videoPlayer.node.on(VideoPlayer.EventType.READY_TO_PLAY,this.callback,this);
    // }
    // callback(videoplayer){
    //     // 这里的 videoplayer 表示的是 VideoPlayer 组件
    //     // 对 videoplayer 进行你想要的操作
    //     // 另外，注意这种方式注册的事件，也无法传递 customEventData
    // }
    @type(VideoPlayer)
    videoPlayer = null;
    start() {
        let canvas = find("Canvas");
        canvas.on(Node.EventType.TOUCH_START, this.playVideo, this);
    }
    playVideo(){
        this.videoPlayer.play();
    }
}


