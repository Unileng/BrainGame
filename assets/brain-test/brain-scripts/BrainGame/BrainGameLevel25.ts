import { _decorator, CCInteger, Component, EventTouch, Label, Node } from 'cc';
import { BrainGameBase } from '../BrainGameBase';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainGameLevel25')
export class BrainGameLevel25 extends BrainGameBase {
    @property(Node)
    private clickNode: Node = null;

    @property(Node)
    private showNode: Node = null;

    @property(Label)
    private showLabel: Label = null;

    @property(CCInteger)
    private rightNum: number = 0;

    private curNum: number = 0;

    init() {
        super.init();
        this.clickNode.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.showNode.active = false;
        this.showLabel.string = this.rightNum.toString();
    }

    hide() {
        super.hide();
        this.clickNode.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchEnd(event: EventTouch): void {
         this.curNum++;
        if(this.curNum == this.rightNum - 1){
            this.showNode.active = true;
        }
        this.showLabel.string = `${this.rightNum - this.curNum}`;
        if (this.curNum >= this.rightNum) {
            this.showRight();
            this.answerRight();
        }
    }
}

