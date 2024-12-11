import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CompA')
export class CompA extends Component {
    onLoad(){
        console.log('CompA onLoad!');
    }
    start() {
        console.log('CompA start!');
    }

    update(deltaTime: number) {
        console.log('CompA update!');
    }
}


