import { _decorator, Component, Node, ToggleComponent, EventHandler, Toggle } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ToggleScript')
export class ToggleScript extends Component {
    // onLoad() {
    //     const checkEventHandler = new EventHandler();
    //     checkEventHandler.target = this.node;
    //     checkEventHandler.component = 'ToggleScript';
    //     checkEventHandler.handler = 'callback';
    //     checkEventHandler.customEventData = 'foobar';
    //     const toggle = this.node.getComponent(ToggleComponent);
    //     toggle.checkEvents.push(checkEventHandler);
    // }
    // callback(event:Event, customEventData:string) {

    // }
    @property(ToggleComponent)
    toggle:ToggleComponent|null = null;
    onLoad(){
        this.toggle.node.on('toggle', this.callback, this);
    }
    callback(toggle:ToggleComponent){
        
    }
}


