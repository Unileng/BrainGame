import { _decorator, Component, Label, Node } from 'cc';
import { BrainGameData } from './BrainGameData';
import { EventManager } from './EventManager';
import { EventDef } from './EventDef';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainLevelItem')
export class BrainLevelItem extends Component {
    public level: number = 0;
    initItem(level: number, isLock: boolean) {
        this.level = level;
        let levelNode = this.node;
        levelNode.getChildByName('lock').active = isLock;
        levelNode.getChildByName('unlock').active = !isLock;
        levelNode.getChildByName('levelNum').getComponent(Label).string = `关卡 ${level}`;
    }

    onBtnClick() {
        if(this.level > BrainGameData.lockMaxLevel) {
            // UIMgr.ins().showToast(`请先解锁上一关关卡`);
            return;
        }
        BrainGameData.currentLevel = this.level;
        EventManager.emit(EventDef.BRAINGAME_EVT_ENTER);
    }
}

