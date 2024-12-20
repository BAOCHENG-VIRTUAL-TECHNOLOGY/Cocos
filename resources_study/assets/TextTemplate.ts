import { _decorator, Component, Node, TextAsset, resources, error } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TextTemplate')
export class TextTemplate extends Component {
    //声明属性itemGiftText的类型为TextAsset
    @property(TextAsset)
    itemGiftText: TextAsset = null!;
    start() {
        const data: string = this.itemGiftText.text!;

        resources.load('itemGiftText',(err: any, res: TextAsset)=>{
            if(err){
                error(err.message||err);
                return;
            }
            //获取文本数据
            const textData = res.text;
        })
    }

    update(deltaTime: number) {
        
    }
}


