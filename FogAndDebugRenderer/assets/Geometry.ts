import { _decorator, Camera, Component, Node, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Geometry')
export class Geometry extends Component {
    @property(Camera)
    mainCamera: Camera = null;
    start() {
        this.mainCamera?.camera.initGeometryRenderer();
    }

    update(deltaTime: number) {
        this.mainCamera?.camera?.geometryRenderer?.addCircle(this.node.worldPosition, 1, Color.GREEN, 20)
    }
}


