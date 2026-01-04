import { _decorator, Collider2D, Component, Node } from 'cc';
import { BrainGameBase } from '../BrainGameBase';
import { BrainGameTouchMoveCom } from '../BrainGameTouchMoveCom';
const { ccclass, property } = _decorator;
//大象进冰箱游戏
@ccclass('BrainGame/BrainGameLevel4')
export class BrainGameLevel4 extends BrainGameBase {
    @property(BrainGameTouchMoveCom)
    private answerTouchMoveCom: BrainGameTouchMoveCom = null;   //大象的触摸移动组件

    @property(Node)
    private boxNode: Node = null;   // 关闭的冰箱

    @property(Node)
    private openBoxNode: Node = null;   // 打开的冰箱


    public init(): void {
        super.init();
        this.boxNode.active = true;
        this.openBoxNode.active = false;
        this.boxNode.on(Node.EventType.TOUCH_END, this.onBoxTouchEnd, this);
        this.answerTouchMoveCom.onColliderCB = this.onAnswerColliderCB.bind(this);

    }

    private onBoxTouchEnd() {
        this.boxNode.active = false;
        this.openBoxNode.active = true;
    }

    private onAnswerColliderCB(self: Node, other: Node) {
        if (other == this.openBoxNode) {
            this.boxNode.active = true;
            this.openBoxNode.active = false;
            this.answerTouchMoveCom.node.active = false;
            this.showRight();
            this.answerRight();
        }
    }

    hide() {
        super.hide();
        this.boxNode.off(Node.EventType.TOUCH_END, this.onBoxTouchEnd, this);
    }

}

