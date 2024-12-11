import { _decorator, Component, Node, Camera, geometry, input, Input, EventTouch, PhysicsSystem } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TouchDetectionFor3DObjects')
export class TouchDetectionFor3DObjects extends Component {
    //Specify the camera rendering the target node.
    @property(Camera)
    readonly cameraCom!:Camera;
    @property(Node)
    public targetNode!:Node;
    private _ray:geometry.Ray = new geometry.Ray();
    onEnable(){
        input.on(Input.EventType.TOUCH_START,this.onTouchStart,this);
    }
    onDisable(){
        input.off(Input.EventType.TOUCH_START,this.onTouchStart,this);
    }
    onTouchStart(event: EventTouch) {
        const touch = event.touch!;
        this.cameraCom.screenPointToRay(touch.getLocationX(), touch.getLocationY(), this._ray);
        if(PhysicsSystem.instance.raycast(this._ray)){
            const raycastResults = PhysicsSystem.instance.raycastResults;
            for(let i=0;i<raycastResults.length;i++){
                const item = raycastResults[i];
                if(item.collider.node == this.targetNode){
                    console.log('raycast hit the target node!');
                    break;
                }
            }
        }else{
            console.log("raycast does not hit the target node!");
        }
    }

}


