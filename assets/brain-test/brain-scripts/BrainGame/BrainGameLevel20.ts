import { _decorator, Component, EventTouch, Node } from 'cc';
import { BrainGameBase } from '../BrainGameBase';
import { BrainGameTouchMoveCom } from '../BrainGameTouchMoveCom';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainGameLevel20')
export class BrainGameLevel20 extends BrainGameBase {
    @property(BrainGameTouchMoveCom)
    private touchMoveNode: BrainGameTouchMoveCom = null;

    @property(Node)
    private rightNode: Node = null;

    @property(Node) //需要移除的位置
    private moveQuitNode: Node = null;

    private canClick: boolean = false;

    init() {
        super.init();
        this.canClick = false
        this.touchMoveNode.onEndContactCB = this.onEndContact.bind(this);
        this.rightNode.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    hide() {
        super.hide();
        this.rightNode.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onEndContact(selfCollider: Node, otherCollider: Node) {
        if (otherCollider === this.moveQuitNode) {
            this.canClick = true;
        }
    }


    private onTouchEnd(event: EventTouch): void {
        if (!this.canClick) {
            return;
        }
        this.showRight();
        this.answerRight();
    }
}

