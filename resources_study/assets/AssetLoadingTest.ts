import { MeshRenderer, SkinnedMeshRenderer, sp } from 'cc';
import { _decorator, Component, Node, resources, instantiate, Prefab, AnimationClip, Animation, SpriteFrame
 ,Sprite,Texture2D, SpriteAtlas,Mesh,Material,Skeleton} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AssetLoadingTest')
export class AssetLoadingTest extends Component {
    start() {
        // resources.load("test_assets/prefab",Prefab,(err,prefab)=>{
        //     const newNode = instantiate(prefab);
        //     this.node.addChild(newNode);
        // });
        // resources.load("test_assets/anim",AnimationClip,(err, clip)=>{
        //     this.node.getComponent(Animation).addClip(clip,"anim");
        // });
        // resources.load("test_assets/image/spriteFrame",SpriteFrame ,(err,spriteFrame)=>{
        //     this.node.getComponent(Sprite).spriteFrame = spriteFrame;
        // });
        // resources.load("test_assets/image/texture",Texture2D,(err,texture)=>{
        //     const spriteFrame = new SpriteFrame();
        //     spriteFrame.texture = texture;
        //     this.node.getComponent(Sprite).spriteFrame = spriteFrame;
        // });
        // resources.load("test_assets/image/spriteAtlas",SpriteAtlas,(err, atlas)=>{
        //     const frame = atlas.getSpriteFrame("1.png");
        //     sprite.spriteFrame = frame;
        // })
        resources.load("Monster/monster",Mesh,(err, mesh)=>{
            this.node.getComponent(MeshRenderer).mesh = mesh;
        })
        resources.load("Monster/monster-effect",Material,(err, material)=>{
            this.node.getComponent(MeshRenderer).material = material;
        })
        resources.load("Monster/Armature",Skeleton,(err, skeleton)=>{
            this.node.getComponent(SkinnedMeshRenderer).skeleton = skeleton;
        })

        resources.loadDir("test_assets",function(err,assets){

        })
        resources.loadDir("test_assets",SpriteFrame,function(err,assets){

        })
    }


    update(deltaTime: number) {
        
    }
}


