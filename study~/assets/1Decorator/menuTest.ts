import { _decorator, Component, Node } from 'cc';
const { ccclass, property , menu} = _decorator;

@ccclass('menuTest')
@menu("foo/bar")
export class menuTest extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }
}


