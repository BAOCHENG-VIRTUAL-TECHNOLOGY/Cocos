import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('say_hello')
export class say_hello extends Component {
    start() {

    }

    update(deltaTime: number) {
        console.log("fuck");
    }
}


