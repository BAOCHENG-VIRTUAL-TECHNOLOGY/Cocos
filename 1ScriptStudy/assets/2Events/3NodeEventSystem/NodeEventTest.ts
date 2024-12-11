import { _decorator, Component, Node, Event } from 'cc';

class NodeEventTest extends Event{
    constructor(name:string, bubbles?:boolean, detail?:any){
        super(name,bubbles);
        this.detail=detail;
    }
    public detail:any=null;//自定义的属性
    //节点c的组件脚本中
    // this.node.dispatchEvent(new MyEvent('foobar',true,'detail info'));
    //节点b的组件脚本中
    // this.node.on('foobar',(event:MyEvent)=>{
    //     event.propagateStop=true;
    // })
    //节点a的组件脚本中
    // this.node.on('foobar',callback,target,true);
}

