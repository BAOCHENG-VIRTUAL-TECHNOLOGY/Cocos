import { _decorator, Component, Node } from 'cc';
const { ccclass, property ,executionOrder} = _decorator;

@ccclass('executionOrderTest')
@executionOrder(3)
export class executionOrderTest extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }
}


