import { _decorator, Component, Node, ScrollView, EventHandler } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScrollViewScript')
export class ScrollViewScript extends Component {
    // onLoad() {
    //     const scrollViewEventHandler = new EventHandler();
    //     scrollViewEventHandler.target = this.node;
    //     scrollViewEventHandler.component = 'ScrollViewScript';
    //     scrollViewEventHandler.handler = 'callback';
    //     scrollViewEventHandler.customEventData = 'foobar';

    //     const scrollview = this.node.getComponent(ScrollView);
    //     scrollview.scrollEvents.push(scrollViewEventHandler);
    // }
    // callback(scrollview, eventType, customEventData) {
    //     // scrollview 是一个Scrollview组件对象实例
    //     //eventType === ScrollView.EvenType enum里面的值
    //     //这里的customEventData参数等于之前设置的'foobar'
    // }
    @property(ScrollView)
    scrollview:ScrollView|null = null;
    onLoad(){
        this.scrollview.node.on('scroll-to-top', this.callback, this);
    }
    callback(scrollview:ScrollView){
        
    }
}


