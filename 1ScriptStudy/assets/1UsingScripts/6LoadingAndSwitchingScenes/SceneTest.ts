import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property} = _decorator;

@ccclass('SceneTest')
export class SceneTest extends Component {
    start() {
        director.loadScene("MyScene");
        // bundle.loadScene('MyScene',function(err,scene){
        //     director.runScene(scene);
        // });
        // director.addPersistRootNode(myNode);
        // director.removePersistRootNode(myNode);
        // director.loadScene("MyScene",onSceneLaunched);
        director.preloadScene("table",function(){
            console.log('Next scene preloaded');
        })
        director.loadScene("table");
    }

    update(deltaTime: number) {
        
    }
}


