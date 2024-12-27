import { _decorator, Component, Node, EffectAsset, Material, resources } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EffectTest')
export class EffectTest extends Component {
    start() {
        const effect = EffectAsset.get('builtin-standard');
        const mat = new Material();
        mat.initialize({effectName:"builtin-standard"});
        resources.load("custom-effect",EffectAsset,(err:Error, data:EffectAsset)=>{
            const effectAsset = EffectAsset.get("../resources/custom-effect");
            const material = new Material();
            material.initialize({effectName:"../resources/custom-effect"});
        })
    }

    update(deltaTime: number) {
        
    }
}


