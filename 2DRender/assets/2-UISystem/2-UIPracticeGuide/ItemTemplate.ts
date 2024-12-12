import { _decorator, Component, Label, Node, Sprite,SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('Item')
export class Item {
    @property
    id = 0;
    @property
    itemName = '';
    @property
    itemPrice = 0;
    @property(SpriteFrame)
    iconSF: SpriteFrame | null = null;
}
@ccclass('ItemTemplate')
export class ItemTemplate extends Component {
    @property
    public id =0;
    @property(Sprite)
    public icon:Sprite|null=null;
    @property(Label)
    public itemName:Label|null=null;
    @property(Label)
    public itemPrice:Number|null=null;
    init(data:Item){
        this.id = data.id;
        this.icon.spriteFrame = data.iconSF;
        this.itemName.string = data.itemName;
        this.itemPrice = data.itemPrice;
    }
}


