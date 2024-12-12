import { _decorator, Component, Node, ToggleContainer, EventHandler, Event, Toggle } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ToggleGroupScript')
export class ToggleGroupScript extends Component {
    onLoad(){
        const containerEventHandler = new EventHandler();
        containerEventHandler.target = this.node;
        containerEventHandler.component = "ToggleGroupScript";
        containerEventHandler.handler = "callback";
        containerEventHandler.customEventData = 'foobar';
        const container = this.node.getComponent(ToggleContainer);
        container.checkEvents.push(containerEventHandler);
    }
    callback(event:Event,customEventData:string) {
        //event 是一个 Touch Event 对象，可以通过 event.target 取到事件的发送节点
        //这里的 customEventData 参数就等于之前设置的 'foobar'
    }
}


