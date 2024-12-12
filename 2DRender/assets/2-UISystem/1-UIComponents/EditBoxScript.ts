import { _decorator, Component, Node, EventHandler, EditBox } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EditBoxScript')
export class EditBoxScript extends Component {
    // onLoad() {
    //     const editboxEventHandler = new EventHandler();
    //     editboxEventHandler.target = this.node;//这个node节点是事件处理代码组件所属的节点
    //     editboxEventHandler.component = 'example';
    //     editboxEventHandler.handler = 'onEditDidBegan';
    //     editboxEventHandler.customEventData = 'foobar';

    //     const editbox = this.node.getComponent(EditBox);
    //     editbox.editingDidBegan.push(editboxEventHandler);
    //     //可以通过类似的方式来注册其他回调函数
    //     //editbox.editingDidEnded.push(editboxEventHandler);
    //     //editbox.textChanged.push(editboxEventHandler);
    //     //editbox.editingReturn.push(editboxEventHandler);
    // }

    // onEditDidBegan(editbox, customEventData){
    //     //editbox是一个EditBox对象
    //     //customEventData参数就等于你之前设置的“foobar”
    // }
    // onEditDidEnded(editbox, customEventData){
    //     //editbox是一个EditBox对象
    //     //customEventData参数就等于你之前设置的“foobar”
    // }
    // onTextChanged(text, editbox, customEventData){
    //     //这里text表示修改后的EditBox的文本内容
    //     //editbox是一个EditBox对象
    //     //customEventData参数就等于你之前设置的“foobar”
    // }
    // onEditingReturn(editbox, customEventData){
    //     //editbox是一个EditBox对象
    //     //customEventData参数就等于你之前设置的“foobar”
    // }
    @property(EditBox)
    editbox:EditBox|null = null;
    onLoad(){
        this.editbox.node.on('editing-did-began',this.callback,this);
    }
    callback(editbox:EditBox){
        //回调的参数是 editbox 组件，注意这种方式注册的事件，无法传递 customEventData
    }
}


