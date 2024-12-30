import { _decorator, Component, Node, Graphics, EffectAsset, Material, Sprite, CCBoolean, CCFloat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Draw')
export class Draw extends Component {
    @property(EffectAsset)
    effect: EffectAsset = null;
    @property(CCFloat) 
    value = 0;
    @property(Sprite)
    spComp = null;
    @property(CCBoolean)
    inverse = false;
    start() {
        // const g = this.getComponent(Graphics);
        // g.fillRect(0, 0, 400, 300);
        // const mat = new Material();
        // mat.initialize({
        //     effectAsset: this.effect, defines:{USE_TEXTURE: false}
        // });
        this.spComp = this.getComponent(Sprite);
        const mat = this.spComp.customMaterial;
        mat.setProperty('dissolveThreshold', 0.1);
    }

    update(deltaTime: number) {
        if (this.inverse) {
            this.value -= deltaTime;
        } else {
            this.value += deltaTime;
        }
        if (this.value >= 1) {
            this.inverse = true;
        }
        if (this.value <= 0) {
            this.inverse = false;
        }
        const mat = this.spComp.customMaterial;
        mat.setProperty('dissolveThreshold', this.value);
    }
}


