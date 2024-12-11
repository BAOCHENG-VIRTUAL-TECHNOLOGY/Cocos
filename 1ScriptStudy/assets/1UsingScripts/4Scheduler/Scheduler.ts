import { _decorator, CCInteger, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Scheduler')
export class Scheduler extends Component {
    @property(CCInteger)
    count: number = 0;
    callback;
    start() {
        this.schedule(function(){
            this.doSomething();
        },5);
        
        let interval = 5;//以秒为单位的时间间隔
        let repeat = 3;//重复次数
        let delay = 10;//开始延时
        this.schedule(function(){
            this.doSomething();
        },interval,repeat,delay);

        this.scheduleOnce(function(){
            this.doSomething();
        },2);

        this.count=0;
        this.callback = function(){
            if(this.count==5){
                this.unschedule(this.callback);
        }
        this.doSomething();
        this.count++;
        }
        this.schedule(this.callback,1);
    }
}


