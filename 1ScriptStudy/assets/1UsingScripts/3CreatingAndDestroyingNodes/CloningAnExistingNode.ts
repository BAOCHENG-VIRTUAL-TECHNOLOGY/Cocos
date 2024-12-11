import { _decorator, Component, Node, instantiate, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CloningAnExistingNode')
export class CloningAnExistingNode extends Component {
    @property({type:Node})
    private target:Node = null;

    start() {
        let scene = director.getScene();
        let node = instantiate(this.target);
        scene.addChild(node);
        node.setPosition(0,0,-10);
    }
}


