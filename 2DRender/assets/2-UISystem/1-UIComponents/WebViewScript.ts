import { _decorator, Component, Node, WebView } from 'cc';
const { ccclass, property,type } = _decorator;

@ccclass('WebViewScript')
export class WebViewScript extends Component {
    // @type(WebView)
    // webview=null;
    // start() {
    //     const eventHandler = new Component.EventHandler();
    //     // eventHandler.target = newTarget;
    //     eventHandler.component = "WebViewScript";
    //     eventHandler.handler = "callback";
    //     eventHandler.customEventData="foobar";
    //     this.webview.clickEvents.push(eventHandler);
    // }

    // callback:function(webview, evenType, customEventData){

    // }

    // @type(WebView)
    // webview=null;
    // start(){
    //     this.webview.node.on(WebView.EventType.LOADED, this.callback, this);
    // }
    // callback(webview){

    // }
    @type(WebView)
    webview=null;
    start(){
        // //这里的Test是webView内部页面代码里定义的全局函数
        // this.webview.evaluateJS('Test()');
        // 这里是与内部页面约定的关键字，请不要使用大写字符，会导致 location 无法正确识别。
        let scheme = "testkey";
        function jsCallback(target, url){
            // 这里的返回值是内部页面的 URL 数值，需要自行解析自己需要的数据。
            let str = url.replace(scheme+'://','');// str === 'a=1&b=2'
            // webview target
            console.log(target);
        }
        this.webview.setJavascriptInterfaceScheme(scheme);
        this.webview.setOnJSCallback(jsCallback);
    }
}


