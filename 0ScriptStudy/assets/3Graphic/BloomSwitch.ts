import { _decorator, Component, DeferredPipeline, Node ,director,Toggle} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BloomSwitch')
export class BloomSwitch extends Component {
    bloomEnabled:boolean=false;
    setupPipeline(){
        (director.root?.pipeline as DeferredPipeline).bloomEnabled = this.bloomEnabled;
    }
    switchEnable(toggle:Toggle){
        if(toggle.isChecked!==this.bloomEnabled){
            this.bloomEnabled=toggle.isChecked;
            this.setupPipeline();
        }
    }
}


