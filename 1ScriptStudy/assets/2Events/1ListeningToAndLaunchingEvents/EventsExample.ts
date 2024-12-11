import { _decorator, Component, Node, EventTarget } from 'cc';
const { ccclass, property } = _decorator;
const eventTarget = new EventTarget();
@ccclass('EventsExample')
export class EventsExample extends Component {
    onLoad(){
        eventTarget.on('foo',(arg1,arg2,arg3)=>{
            console.log(arg1,arg2,arg3);
        })
    }
    start() {
        let arg1=1,arg2=2,arg3=3;
        //最多发射5个参数
        eventTarget.emit('foo',arg1,arg2,arg3);
    }

    update(deltaTime: number) {
        
    }
}


