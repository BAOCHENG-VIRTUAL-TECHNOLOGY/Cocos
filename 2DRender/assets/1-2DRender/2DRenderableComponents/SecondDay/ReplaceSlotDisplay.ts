import { _decorator, Component, Node, dragonBones } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ReplaceSlotDisplay')
export class ReplaceSlotDisplay extends Component {
    @property({type:dragonBones.ArmatureDisplay})
    armatureDisplay:dragonBones.ArmatureDisplay|null=null
    @property({type:dragonBones.ArmatureDisplay})
    replaceArmatureDisplay:dragonBones.ArmatureDisplay|null=null

    _leftWeaponIndex=0;
    _rightDisplayIndex=0;
    _rightDisplayNames:string[]=[];
    _rightDisplayOffset:{x:number, y:number}[]=[];

    start(){
        this.replaceArmatureDisplay!.node.active=false;
        this._leftWeaponIndex=0;
        this._rightDisplayIndex=0;
        this._rightDisplayNames=["weapon_1","weapon_2"];
        this._rightDisplayOffset=[
            {x:0,y:0},{x:-60,y:100}
        ];
    }
    left(){
        let armature = this.armatureDisplay!.armature();
        let slot = armature!.getSlot("weapon_1");
        slot!.displayIndex = slot!.displayIndex ==0?4:0;
    }
    right(){
        this._rightDisplayIndex++;
        this._rightDisplayIndex%=this._rightDisplayNames.length;
        let armature = this.armatureDisplay!.armature();
        let slot = armature!.getSlot("weapon_2");
        let replaceArmatureName = this.replaceArmatureDisplay!.armatureName;
        const displayName = this._rightDisplayNames[this._rightDisplayIndex];
        let factory = dragonBones.CCFactory.getInstance() as any;
        factory.replaceSlotDisplay(this.replaceArmatureDisplay!.getArmatureKey(),"weapon_1",displayName,slot);
        let offset = this._rightDisplayOffset[this._rightDisplayIndex];
        slot!.parent.offset.x=offset.x;
        slot!.parent.offset.y=offset.y;
        armature!.invalidUpdate();
    }
}


