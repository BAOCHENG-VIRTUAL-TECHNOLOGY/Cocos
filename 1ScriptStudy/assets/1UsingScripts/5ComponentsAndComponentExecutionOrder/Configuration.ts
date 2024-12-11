import { _decorator, Component, Node } from 'cc';
const { ccclass, property, executionOrder } = _decorator;

@ccclass('Configuration')
@executionOrder(-1)
export class Configuration extends Component {
    onLoad() {
        console.log('Configuration onLoad!');
    }
    static init(){

    }
    static updateConfig(deltaTime:number){
        
    }
    start() {

    }

    update(deltaTime: number) {
        
    }
}


