import { _decorator, Component, Node, Prefab, instantiate, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CreatingAPrefabNode')
export class CreatingAPrefabNode extends Component {
    @property({type:Prefab})
    private target:Prefab = null;
    start() {
        let scene = director.getScene();
        let node = instantiate(this.target);
        scene.addChild(node);
        node.setPosition(0,0,0);
    }

    update(deltaTime: number) {
        
    }
}


