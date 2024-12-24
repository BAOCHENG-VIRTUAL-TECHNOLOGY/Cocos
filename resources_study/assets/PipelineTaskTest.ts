import { _decorator, Component, Node, assetManager, AssetManager } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PipelineTaskTest')
export class PipelineTaskTest extends Component {
    start() {
        assetManager.pipeline.insert(function(task,done){
            task.output=task.input;
            for(let i=0;i<task.input;i++){
                console.log(task.input[i].content);
            }
            done();
        },1);
        const pipeline = new AssetManager.Pipeline('test', [(task, done)=>{
            console.log('first step');
            done();
        },(task,done)=>{
            console.log('second step');
            done();
        }]);
        assetManager.pipeline.insert(function(task,done){
            for(let i=0;i<task.input.length;i++){
                task.input[i].content = null;
            }
            task.output=task.input;
            done();
        },1);
    }

    update(deltaTime: number) {
        
    }
}


