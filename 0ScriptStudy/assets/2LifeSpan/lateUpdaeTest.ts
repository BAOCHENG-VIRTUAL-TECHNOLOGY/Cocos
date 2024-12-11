import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('lateUpdaeTest')
export class lateUpdaeTest extends Component {

    lateUpdate(deltaTime: number) {
        this.node.setPosition(0.0,50,0.0);
    }
}


