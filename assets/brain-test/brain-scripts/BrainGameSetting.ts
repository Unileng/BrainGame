import { _decorator, Component, Node, Toggle } from 'cc';
import { BrainGameData } from './BrainGameData';
const { ccclass, property } = _decorator;

@ccclass('BrainGameSetting')
export class BrainGameSetting extends Component {
    @property({ type: Toggle, displayName: '关闭按钮', })
    closeBtn: Toggle = null;

    @property({ type: Toggle, displayName: '打开按钮', })
    openBtn: Toggle = null;

    closeClickCB: () => void = null;

    show(closeClickCB: () => void) {
        this.closeClickCB = closeClickCB;
        this.node.active = true;
        this.closeBtn.isChecked = !BrainGameData.audioEnabled;
        this.openBtn.isChecked = BrainGameData.audioEnabled;
    }

    hide(){
        this.node.active = false;
    }

    onToggleSettingClick() {
       let isOpen = this.openBtn.isChecked;
       BrainGameData.audioEnabled = isOpen;
    }

    onBtnCloseClick() {
        this.node.active = false;
        if (this.closeClickCB) {
            this.closeClickCB();
        }
    }
}

