import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ObtainingOtherComponents')
export class ObtainingOtherComponents extends Component {
    private label: any=null  
    start() {
        // 获得同一个节点上的其它组件
        this.label = this.getComponent(Label);
        if(this.label){
            this.label.string="Hello";
        }else{// 如果在节点上找不到需要的组件
            console.error("Something wrong?");
        }
        let text = this.name +'started';
        this.label.string = text;
        // 获得用户定义的组件
        let rotate = this.getComponent("SinRotate");
        // 在节点上也有一个 getComponent 方法，它们的作用是一样的
        console.log(this.node.getComponent(Label)===this.getComponent(Label));

    }
}


