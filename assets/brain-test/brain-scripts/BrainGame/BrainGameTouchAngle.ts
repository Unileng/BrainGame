import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainGameTouchAngle')
export class BrainGameTouchAngle extends Component {
    public topClickCB: Function = null;
    public bottomClickCB: Function = null;
    public leftClickCB: Function = null;
    public rightClickCB: Function = null;

    public cancelCB: Function = null;

    onBtnLeftClick() {
        if (this.leftClickCB) {
            this.leftClickCB();
        }
    }

    onBtnRightClick() {
        if (this.rightClickCB) {
            this.rightClickCB();
        }
    }

    onBtnTopClick() {
        if (this.topClickCB) {
            this.topClickCB();
        }
    }

    onBtnBottomClick() {
        if (this.bottomClickCB) {
            this.bottomClickCB();
        }
    }

    onBtnCancel() {
        if (this.cancelCB) {
            this.cancelCB();
        }
    }
}

