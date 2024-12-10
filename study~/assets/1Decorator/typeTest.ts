import { _decorator, Node, CCInteger, Enum} from 'cc';
const { ccclass, property } = _decorator;

enum A{
    c,
    d
}
Enum(A);
@ccclass('typeTest')
class MyClass {
    @property//javascript原始类型，根据默认值自动识别为Creator的浮点数类型
    index = 0;
    @property(Node)//生命属性cc类型为Node.当属性参数只有type时可这么写,等价于@property({type: Node})
    targetNode:Node | null = null;
    // 声明属性children的cc类型为Node数组
    @property({type:[Node]})
    children:Node[]=[];
    @property({
        type:String,
    })//警告：不应该使用构造函数String。等价于CCString。也可以选择不声明类型
    text="";
    @property
    children2=[];//未声明cc类型，从初始化式的求值结果推断元素为未定义的数组
    @property
    _valueB='abc';//此处'_'开头的属性，只序列化，不会在编辑器属性面板显示
    @property({type:A})
    accx:A=A.c;
}




