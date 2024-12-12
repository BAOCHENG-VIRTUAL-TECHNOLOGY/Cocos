import { _decorator, Component, Node, Mask, Graphics, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MaskScript')
export class MaskScript extends Component {
    start(){
        // const mask = this.getComponent(Mask);
        // mask.type = Mask.Type.GRAPHICS_ELLIPSE;
        // mask.segments = 32;
        // const g = mask.node.getComponent(Graphics);
        // g.lineWidth=10;
        // g.fillColor.fromHEX('#ff0000');
        // g.moveTo(-40,0);
        // g.lineTo(0,-80);
        // g.lineTo(40,0);
        // g.lineTo(0,80);
        // g.close();
        // g.stroke();
        // g.fill();
        const mask = this.getComponent(Mask);
        mask.type = Mask.Type.GRAPHICS_STENCIL;
        const sprite = this.getComponent(Sprite);
        // sprite.spriteFrame = this.stencilSprite;
        mask.alphaThreshold=0.1;
    }
}


