import { _decorator, Component, Node, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIOpacityScript')
export class UIOpacityScript extends Component {
    start() {
        const opacityComp = this.getComponent(UIOpacity);
        opacityComp.opacity = 100;
    }

    update(deltaTime: number) {
        
    }
}


