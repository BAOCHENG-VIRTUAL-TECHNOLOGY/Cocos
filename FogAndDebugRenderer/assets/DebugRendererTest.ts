import { _decorator, Component, Node, Vec2, native } from 'cc';
const { ccclass, property } = _decorator;
import { NATIVE } from 'cc/env';
@ccclass('DebugRendererTest')
export class DebugRendererTest extends Component {
    start() {

    }

    update(deltaTime: number) {
        if(NATIVE){
            native.DebugRenderer.getInstance().addText("DebugRendererTest", new Vec2(100, 100));
        }
    }
}


