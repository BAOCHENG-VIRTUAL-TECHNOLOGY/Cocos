import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NodeStatusAndLevelOperations')
export class NodeStatusAndLevelOperations extends Component {
    @property({type:Node})
    private parentNode: Node = null;
    start() {
        this.node.active = true;
    }

    update(deltaTime: number) {
        // this.node.parent=parentNode;
        // parentNode.addChild(this.node);
    }
}


