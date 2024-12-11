import { _decorator, Component, Node, SpriteFrame, Texture2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HowToSetAssetsInTheInspectorPanel')
export class HowToSetAssetsInTheInspectorPanel extends Component {
    @property({type: Texture2D})
    private texture : Texture2D = null;
    @property({type: SpriteFrame})
    private spriteFrame : SpriteFrame = null;
    start() {
        let spriteFrme = this.spriteFrame;
        let texture = this.texture;
    }
}


