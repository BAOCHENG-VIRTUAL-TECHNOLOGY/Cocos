import { _decorator, Component, Node, Camera, MeshRenderer, RenderTexture, Material } from 'cc';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('RenderCameraToModel')
@requireComponent(Camera)
export class RenderCameraToModel extends Component {
    @property(MeshRenderer)
    start() {
        const renderTex = new RenderTexture();
        renderTex.reset({
            width: 256,
            height: 256,
        });
        const cameraComp = this.getComponent(Camera);
        cameraComp.targetTexture = renderTex;
        const pass = this.model.material.passes[0];
        const defines = {SAMPLE_FROM_RT: true,...pass.defines};
        const renderMat = new Material();
        renderMat.initialize({
            effectAsset: this.model.material.effectAsset,
            defines,
        });
        this.model.setMaterial(renderMat, 0);
        renderMat.setProperty('mainTexture',renderTex,0);
    }

    update(deltaTime: number) {
        
    }
}


