import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('updateTest')
export class updateTest extends Component {

    update(deltaTime: number) {
        this.node.setPosition(0.0,40.0*deltaTime,0.0);
    }
}


