import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Global')
export class Global extends Component {
    public static backNode:any = null;
    public static backLabel:any = null;
}


