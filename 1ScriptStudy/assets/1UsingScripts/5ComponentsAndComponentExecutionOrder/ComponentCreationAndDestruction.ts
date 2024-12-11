import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { MyComponent } from './MyComponent';
@ccclass('ComponentCreationAndDestruction')
export class ComponentCreationAndDestruction extends Component {
    start() {
        const myCompmonent = this.node.addComponent(MyComponent);
        myCompmonent.printNodeName();
        this.node.removeComponent(MyComponent);
    }

    update(deltaTime: number) {
        
    }
}


