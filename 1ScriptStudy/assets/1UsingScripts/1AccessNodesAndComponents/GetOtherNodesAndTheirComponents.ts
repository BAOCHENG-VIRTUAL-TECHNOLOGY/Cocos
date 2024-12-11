import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GetOtherNodesAndTheirComponents')
export class GetOtherNodesAndTheirComponents extends Component {
    //声明Player属性
    @property({type:Node})
    private player = null;

    start(){
        console.log('The player is '+this.player.name);
        let PlayerComp = this.player;
    }
}


