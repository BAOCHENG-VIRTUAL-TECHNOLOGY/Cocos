import { _decorator, Component, Node, Graphics, EffectAsset, Material } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Draw')
export class Draw extends Component {
    @property(EffectAsset)
    effect: EffectAsset = null;
    start() {
        // const g = this.getComponent(Graphics);
        // g.fillRect(0, 0, 400, 300);
        const mat = new Material();
        mat.initialize({
            effectAsset: this.effect, defines:{USE_TEXTURE: false}
        });
    }

    update(deltaTime: number) {
        
    }
}


