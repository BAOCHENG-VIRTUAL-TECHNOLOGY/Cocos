import { _decorator, Component, Node, EventTarget } from 'cc';
const { ccclass, property } = _decorator;
const eventTarget = new EventTarget();
@ccclass('ListeningToAndLaunchingEvents')
export class ListeningToAndLaunchingEvents extends Component {
    // eventTarget.on(type,func,target?);
    onEnable(){
        eventTarget.on('foobar',this._sayHello, this);
    }
    onDisable(){
        eventTarget.off('foobar',this._sayHello,this);
    }
    _sayHello(){
        console.log('Hello World');
    }
    start() {
        // // 使用函数绑定
        // eventTarget.on('foo',function(event){
        //     this.enabled = false;
        // }.bind(this));
        // // 使用第三个参数
        // eventTarget.on('foo',(event)=>{
        //     this.enabled = false;
        // }, this);
        // 取消对象身上所有注册的该类型的事件
        // eventTarget.off(type);
        // 取消对象身上该类型指定回调指定目标的事件
        // eventTarget.off(type, func, target);

        //事件发射的时候可以指定事件参数,参数最多支持5个事件参数
        // eventTarget.emit(type,...args);
    }

    update(deltaTime: number) {
        
    }
}


