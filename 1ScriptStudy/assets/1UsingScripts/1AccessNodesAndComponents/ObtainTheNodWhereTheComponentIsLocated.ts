import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ObtainTheNodeWhereTheComponentIsLocated')
export class ObtainTheNodeWhereTheComponentIsLocated extends Component {
    start() {
        let node = this.node;
        node.setPosition(0.0, 0.0, 0.0);
    }

    update(deltaTime: number) {
        
    }
}


