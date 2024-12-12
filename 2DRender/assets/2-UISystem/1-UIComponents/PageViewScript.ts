import { _decorator, Component, Node, Event, PageView, EventHandler } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PageViewScript')
export class PageViewScript extends Component {
    // onLoad() {
    //     const pageChangedEventHandler = new EventHandler();
    //     pageChangedEventHandler.target = this.node;
    //     pageChangedEventHandler.component = "PageViewScript";
    //     pageChangedEventHandler.handler = "callback";
    //     const page = this.node.getComponent(PageView)
    //     // page.clickEvents.push(pageChangedEventHandler);
    // }
    onLoad(){
        // this.pageView.node.on('page-turning', this.callback, this);
    }

    callback(event:Event,customEventData:string) {
        const node = event.target as Node;
        const pageview = node.getComponent(PageView);
        console.log(customEventData);
    }
}


