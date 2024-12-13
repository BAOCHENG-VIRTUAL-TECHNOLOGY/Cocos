import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TiledTileScript')
export class TiledTileScript extends Component {
    start() {
        // const node = new Node();
        // node.parent = this.layer.node;
        // const tiledTile = node.addComponent(TiledTile);
        // const tiledTile = this.layer.getTiledTileAt(0,0);
    }

    update(deltaTime: number) {
        
    }
}


