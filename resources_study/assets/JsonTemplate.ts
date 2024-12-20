import { _decorator, Component, Node, JsonAsset, resources, error } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JsonTemplate')
export class JsonTemplate extends Component {
    //声明属性'itemGiftJson'的类型为JsonAsset
    @property(JsonAsset)
    itemGiftJson: JsonAsset = null!;
    start() {
        //获取到Json数据
        const jsonData: object = this.itemGiftJson.json;

        resources.load('gameGiftJson',(err:any, res:JsonAsset)=>{
            if(err){
                error(err.message||err);
                return;
            }
            //获取到Json数据
            const jsonData : object = res.json!;
        })
    }

    
}


