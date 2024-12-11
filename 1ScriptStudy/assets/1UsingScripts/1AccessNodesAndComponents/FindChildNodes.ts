import { _decorator, Component, Node, find } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FindChildNodes')
export class FindChildNodes extends Component {
    start() {
        let cannons = this.node.children;
        this.node.getChildByName("Cannon 01");
        find("Cannon 01/Barrel/SFX",this.node);
        // this.backNode = find("Canvas/Menu/Back");
    }

    update(deltaTime: number) {
        
    }
}


