import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CompB')
export class CompB extends Component {
    onLoad(){
        console.log('CompB onLoad!');
    }
    start() {
        console.log('CompB start!');
    }

    update(deltaTime: number) {
        console.log('CompB update!');
    }
}



