import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;
import {Global} from "./Global";
@ccclass('AccessingValuesInExistingVariables')
export class AccessingValuesInExistingVariables extends Component {
    onLoad(){
        Global.backNode = this.node;
        Global.backLabel = this.getComponent(Label);
    }
}


