import { _decorator, Node, rendering, renderer, game, Game} from 'cc';
import {AntiAliasing,buildForwardPass,buildBloomPasses,
    buildFxaaPass,buildPostprocessPass,buildUIPass,isUICamera,decideProfilerCamera}from './PassUtils';
export class TestCustomPipeline implements rendering.PipelineBuilder {
    setup(cameras: renderer.scene.Camera[], pipeline: rendering.Pipeline) :void{
        decideProfilerCamera(cameras);
        for(let i=0;i<cameras.length;i++){
            const camera =cameras[i];
            if(camera.scene===null){
                continue;
            }
            const isGameView = camera.cameraUsage === renderer.scene.CameraUsage.GAME
                ||camera.cameraUsage===renderer.scene.CameraUsage.GAME_VIEW;
            if(!isGameView){
                //forward pass
                buildForwardPass(camera,pipeline,isGameView);
                continue;
            }
            //实际的项目并不是那么简单地确定ui是否摄像头，这里只是作为一个演示。
            if(!isUICamera(camera)){
                //forward pass
                const forwardInfo = buildForwardPass(camera,pipeline,isGameView);
                //fxaa pass
                const fxaaInfo = buildFxaaPass(camera,pipeline,forwardInfo.rtName);
                //bloom pass
                const bloomInfo = buildBloomPasses(camera,pipeline,fxaaInfo.rtName);
                //present pass
                buildPostprocessPass(camera,pipeline,bloomInfo.rtName,AntiAliasing.NONE);
                continue;
            }
            //render ui
            buildUIPass(camera,pipeline);
        }
    }
}

game.on(Game.EVENT_RENDERER_INITED,()=>{
    rendering.setCustomPipeline('Test',new TestCustomPipeline);
})