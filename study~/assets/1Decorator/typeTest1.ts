import { _decorator, Node, CCInteger, Enum} from 'cc';
const { ccclass, property,integer,float,type } = _decorator;
@ccclass('typeTest1')
class MyClass {
    @integer//声明属性的cc类型为整数
    index =0;
    @type([Node])//声明属性children的cc类型为Node数组
    children:Node[]=[];
    @type(String)//不应该使用构造函数String。等价于CCString。也可以选择不声明类型
    text1 = '';
    //JavaScript原始类型'number','string','boolean'通常可以不用声明
    @property
    text2 = '';
    //visible
    @property({visible:true})
    private _num=0;
    @property({visible:false})
    num=0;
    @property({serializable:false})
    num1=0;
    @property({tooltip:"my id",override:true})
    id="";
    
}