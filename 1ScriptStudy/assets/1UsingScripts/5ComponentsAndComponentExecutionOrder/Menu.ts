import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property, executionOrder } = _decorator;

@ccclass('Menu')
@executionOrder(1)
export class Menu extends Component {
    onLoad() {
        console.log('Menu onLoad!');
    }
    static updateMenu(deltaTime:number){}   
    static init(){

    }
    start() {

    }

    update(deltaTime: number) {
        
    }
}


