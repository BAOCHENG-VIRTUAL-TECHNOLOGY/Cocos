import { _decorator, Component, Node ,Label,Sprite} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('groupTest')
export class groupTest extends Component {
    @property({group:{name:'bar'},type:Label})
    label:Label=null!;
    @property({group:{name:'foo'},type:Sprite})
    sprite:Sprite=null!;
    @property({group:{name:'bar2',id:'2',displayOrder:1},type:Label})
    label2:Label=null!;
    @property({group:{name:'bar2',id:'2'},type:Sprite})
    sprite2:Sprite=null!;
}


