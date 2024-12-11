import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import {Global} from './Global';
@ccclass('AnyScript')
export class AnyScript extends Component {
    start() {
        const text = "Back";
        Global.backLabel.string = text;
    }
}


