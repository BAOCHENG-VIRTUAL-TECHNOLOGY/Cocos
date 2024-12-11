import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('startTest')
export class startTest extends Component {
    private  _timer:number=0.0;

    start() {
        this._timer=1.0;
    }

    update(deltaTime: number) {
        this._timer+=deltaTime;
        if(this._timer>=10.0){
            console.log("I am done!");
            this.enabled = false;
        }
    }
}


