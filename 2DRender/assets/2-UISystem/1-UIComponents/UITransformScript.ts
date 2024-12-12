import { _decorator, Component, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UITransformScript')
export class UITransformScript extends Component {
    start() {
        const uiTransform = this.getComponent(UITransform);
        // 方法一
        uiTransform.setContentSize(200,120);
        uiTransform.setAnchorPoint(0,0.5);
        // 方法二
        uiTransform.width = 200;
        uiTransform.height = 120;
        uiTransform.anchorX = 0;
        uiTransform.anchorY = 0.5;
    }
}


