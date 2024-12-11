import { _decorator, Component, Node,macro } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NodeEventTest1')
export class NodeEventTest1 extends Component {
    start() {
        macro.ENABLE_MULTI_TOUCH=false;
        // 暂停当前节点上注册的所有节点系统事件，节点系统事件包含触摸和鼠标事件。
        // 如果传递参数 true，那么这个 API 将暂停本节点和它的所有子节点上的节点系统事件。
        this.node.pauseSystemEvents(true);
        // 恢复当前节点上注册的所有节点系统事件，节点系统事件包含触摸和鼠标事件。
        // 如果传递参数 true，那么这个 API 将恢复本节点和它的所有子节点上的节点系统事件。
        this.node.resumeSystemEvents(true);
    }

    update(deltaTime: number) {
        
    }
}


