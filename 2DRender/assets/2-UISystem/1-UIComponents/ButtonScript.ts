import { _decorator, Component, Node, EventHandler, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ButtonScript')
export class ButtonScript extends Component {
    // onLoad(){
    //     const clickEventHandler = new EventHandler();
    //     clickEventHandler.target = this.node;//这个node节点是事件处理代码组件所属的节点
    //     clickEventHandler.component = 'ButtonScript';//这个是脚本类名
    //     clickEventHandler.handler = 'callback';
    //     clickEventHandler.customEventData = 'foobar';
    //     const button = this.node.getComponent(Button);
    //     button.clickEvents.push(clickEventHandler);
    // }
    // callback(event:Event, customEventData:string){
    //     //这里event是一个Touch Event对象，你可以通过event.target取到事件的发送节点
    //     const node = event.target as Node;
    //     const button = node.getComponent(Button);
    //     console.log(customEventData);//foobar
    // }

    //假设我们在一个组件的onLoad方法里面添加事件处理回调，在callback函数中进行事件处理
    @property(Button)
    button:Button|null = null;
    onLoad(){
        this.button.node.on(Button.EventType.CLICK, this.unscheduleAllCallbacks, this);
    }
    callback(button: Button){
        //注 注意这种方式注册的事件，无法传递customEventData
    }
}


