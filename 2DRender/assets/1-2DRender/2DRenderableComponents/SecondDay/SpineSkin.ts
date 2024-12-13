import { _decorator, Component, Node, sp } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpineSkin')
export class SpineSkin extends Component {
    @property({type:sp.Skeleton})
    spine:sp.Skeleton|null=null;
    skinId:number =0;
    start() {

    }

    change(){
        const skins=['girl','boy','girl-blue-cape','girl-sprint-dress'].map(x=>'full-skins/${x}');
        this.skinId=(this.skinId+1)%skins.length;
        this.spine!.setSkin(skins[this.skinId]);
    }
}


