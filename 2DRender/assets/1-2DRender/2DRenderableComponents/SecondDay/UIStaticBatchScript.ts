import { _decorator, Component, Node, UIStaticBatch } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIStaticBatchScript')
export class UIStaticBatchScript extends Component {
    start() {
        const uiStatic = this.node.getComponent(UIStaticBatch);
        // 选择你要开始静态合批的时机，调用此接口开始静态合批
        uiStatic.markAsDirty();
    }
}


