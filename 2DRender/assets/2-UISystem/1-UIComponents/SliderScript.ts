import { _decorator, Component, Node, EventHandler, Slider, Event } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SliderScript')
export class SliderScript extends Component {
    // onLoad() {
    //     const sliderEventHandler = new EventHandler();
    //     sliderEventHandler.target = this.node;
    //     sliderEventHandler.component = 'SliderScript';
    //     sliderEventHandler.handler = 'callback';
    //     sliderEventHandler.customEventData = 'foobar';
    //     const slider = this.node.getComponent('Slider');
    //     // slider!.slideEvents.push(sliderEventHandler);
    // }
    // callback(slider: Slider, customEventData: string) {
        
    // }
    @property(Slider)
    slider:Slider|null = null;
    onLoad(){
        this.slider!.node.on('slide', this.callback, this); 
    }
    callback(slider:Slider){
        
    }
}



