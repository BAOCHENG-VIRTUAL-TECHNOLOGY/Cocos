import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DestroyTheNode')
export class DestroyTheNode extends Component {
    @property({type:Node})
    private target:Node = null;
    private positionz:number=-20;
    start() {
        // 5秒后销毁节点
        setTimeout(function(){
            this.target.destory();
        }.bind(this),5000);
    }

    update(deltaTime: number) {
        console.info(this.target.isValid);
        this.positionz += 1*deltaTime;
        if(this.target.isValid){
            this.target.setPosition(0,0,this.positionz);
        }    
    }
}


