import { _decorator, Component, Node, Widget } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WidgeScript')
export class WidgeScript extends Component {
    start() {
        const widget = this.getComponent(Widget);
        // 设置默认对齐单位是px
        widget!.bottom = 50;
        widget!.top = 50;
        // 设置对齐单位是%
        widget!.isAbsoluteTop = false;
        widget!.isAbsoluteBottom = false;
        widget!.bottom = 0.1;
        widget!.top = 0.1;
    }
}


