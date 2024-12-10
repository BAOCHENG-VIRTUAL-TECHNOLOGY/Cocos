import { _decorator, Component, Node ,Sprite} from 'cc';
const { ccclass, property ,requireComponent} = _decorator;

@ccclass('requireComponentTest')
@requireComponent(Sprite)
export class requireComponentTest extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }
}


