import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { Configuration } from './Configuration';
import { GameData } from './GameData';
import { Menu } from './Menu';

@ccclass('Game')
export class Game extends Component {
    private configuration = Configuration;
    private gameData = GameData;
    private menu = Menu;
    onLoad(){
        this.configuration.init();
        this.gameData.init();
        this.menu.init();
    }
    update(deltaTime:number){
        this.configuration.updateConfig(deltaTime);
        this.gameData.updateData(deltaTime);
        this.menu.updateMenu(deltaTime);
    }
}


