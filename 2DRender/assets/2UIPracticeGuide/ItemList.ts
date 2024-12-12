import { _decorator, Component, Node, SpriteFrame, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('Item')
export class Item{
    @property
    id=0
    @property
    itemName='';
    @property
    itemPrice =0
    @property(SpriteFrame)
    iconSF:SpriteFrame|null=null;
}

@ccclass('ItemList')
export class ItemList extends Component {
    @property([Item])
    items:Item[]=[];
    @property(Prefab)
    itemPrefab:Prefab|null=null;
    onLoad(){
        for(let i=0;i<this.items.length;i++){
            const item = instantiate(this.itemPrefab);
            const data = this.items[i];
            // this.node.addChild(item);
            // item.getComponent('ItemTemplate').init(data);
        }
    }
}


