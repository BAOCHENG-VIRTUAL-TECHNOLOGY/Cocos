import { _decorator, Component, Node, SpriteFrame, find } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('onLoadTest')
export class onLoadTest extends Component {
    @property({type:SpriteFrame})
    bulletSprite=null;
    @property({type:Node})
    gun=null;
    _bulletRect=null;
    onLoad(){
        this._bulletRect=this.bulletSprite.getRect();
        this.gun=find('hand/weapon',this.node);
    }
}


