import { _decorator, Component, Node, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DeclarationOfAssetAttributes')
export class DeclarationOfAssetAttributes extends Component {
    @property({type: SpriteFrame})
    private spriteFrame:SpriteFrame = null
    start() {

    }

    update(deltaTime: number) {
        
    }
}


