import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CreatingANewNode')
export class CreatingANewNode extends Component {
    start() {
        let node = new Node('box');
        node.setPosition(0,0,-10);
    }
}


