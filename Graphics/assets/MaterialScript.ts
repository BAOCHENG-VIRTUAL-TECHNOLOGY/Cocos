import { _decorator, Component, Node, Material, MeshRenderer, Sprite, ParticleSystem, RenderableComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MaterialScript')
export class MaterialScript extends Component {
    start() {
        const mat = new Material();
        mat.initialize({
            effectName:  'pipeline/skybox',
            defines:{
                USE_RGBE_CUBEMAP: true
            }
        })
        let renderable = this.getComponent(MeshRenderer);
        let material = renderable.getMaterial(0);
        renderable.setMaterial(mat, 0);
        let sprite = this.node.getComponent(Sprite);
        let customMaterial = sprite.customMaterial;
        sprite.customMaterial = mat;
        let particleSystem = this.getComponent(ParticleSystem);
        const material = particleSystem.material;
        particleSystem.material = material;

        const trailMaterial = particleSystem.renderer.trailMaterial;
        particleSystem.renderer.trailMaterial = trailMaterial;

        // mat.setProperty("uniform name", uniformValue);
        let renderableComponent = this.node.getComponent(MeshRenderer)  as RenderableComponent;
        let sharedMaterial = renderableComponent.sharedMaterial
        let sharedMaterials = renderableComponent.sharedMaterials
        let sharedMaterial = renderableComponent.getMaterial(0)

        let renderableComponent = this.node.getComponent(MeshRenderer) as RenderableComponent;
        let materialInstances = renderableComponent.materials;
        let materialInstance = renderableComponent.material;
        let materialInstances = renderableComponent.getMaterialInstance(material);
    }

    update(deltaTime: number) {
        
    }
}