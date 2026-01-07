import { _decorator, Component, Node, Toggle } from 'cc';
import { BrainGameData } from './BrainGameData';
import { AudioMgr } from './AudioMgr';
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
        this.closeBtn.isChecked = !AudioMgr.ins().isMusicMuted();
        this.openBtn.isChecked = AudioMgr.ins().isMusicMuted();
    }

    hide(){
        this.node.active = false;
    }

    onToggleSettingClick() {
       let isOpen = this.openBtn.isChecked;
       AudioMgr.ins().setMusicMuted(!isOpen);
       AudioMgr.ins().playMusicFromBundle('brain-res', 'audio/bg');
    }

    onBtnCloseClick() {
        this.node.active = false;
        if (this.closeClickCB) {
            this.closeClickCB();
        }
    }
}

