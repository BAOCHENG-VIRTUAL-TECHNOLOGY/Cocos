import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ChangingNodeTransformations')
export class ChangingNodeTransformations extends Component {
    start() {
        this.node.setPosition(100,50,100);
        this.node.setPosition(new Vec3(100,50,100));
        this.node.position = new Vec3(100,0,100);
        // this.node.setRotation(90,90,90);
        this.node.setRotationFromEuler(90,90,90);
        this.node.setScale(2,2,2);
    }
    

    update(deltaTime: number) {
        
    }
}


