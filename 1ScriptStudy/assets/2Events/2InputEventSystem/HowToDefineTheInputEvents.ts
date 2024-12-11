import { _decorator, Component, Node,input,Input,EventTouch, EventKeyboard,KeyCode, EventAcceleration, log} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HowToDefineTheInputEvents')
export class HowToDefineTheInputEvents extends Component {
    onLoad() {
        // input.on(Input.EventType.TOUCH_START,this.onTouchStart,this);
        // input.on(Input.EventType.KEY_DOWN,this.onKeyDown,this);
        // input.on(Input.EventType.KEY_UP,this.onKeyUp,this);
        input.setAccelerometerEnabled(true);
        input.on(Input.EventType.DEVICEMOTION,this.onDeviceMotionEvent,this);
    }
    onDestroy() {
        // input.off(Input.EventType.TOUCH_START,this.onTouchStart,this);
        // input.off(Input.EventType.KEY_DOWN,this.onKeyDown,this);
        // input.off(Input.EventType.KEY_UP,this.onKeyUp,this);
        input.off(Input.EventType.DEVICEMOTION,this.onDeviceMotionEvent,this);
    }

    onDeviceMotionEvent(event:EventAcceleration){
        log(event.acc.x+" "+event.acc.y)    
    }
    // onTouchStart(event:EventTouch){
    //     console.log(event.getLocation());//Location on screen space
    //     console.log(event.getUILocation());//Location on UI space
    // }

    // onKeyDown(event:EventKeyboard){
    //     switch(event.keyCode){
    //         case KeyCode.KEY_A:
    //             console.log('A');
    //             break;
    //     }
    // }
    // onKeyUp(event:EventKeyboard){
    //     switch(event.keyCode){
    //         case KeyCode.KEY_A:
    //             console.log('Release a key');
    //             break;
    //     }
    // }
    start() {

    }

    update(deltaTime: number) {
        
    }
}


