import { _decorator, Component, Node } from 'cc';
const { ccclass, property ,disallowMultiple} = _decorator;

@ccclass('disallowMultipleTest')
@disallowMultiple(true)
export class disallowMultipleTest extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }
}


