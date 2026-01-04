import { _decorator, Component, EventTouch, Node } from 'cc';
import { BrainGameBase } from '../BrainGameBase';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainGameLevel12')
export class BrainGameLevel12 extends BrainGameBase {
    @property(Node)
    private moveNode: Node = null;

    init() {
        super.init();
        this.moveNode.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.moveNode.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.moveNode.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.moveNode.x = -75;
    }

    // 触摸移动时跟随鼠标移动x轴
    private onTouchMove(event: EventTouch) {
        const delta = event.getDelta();
        this.moveNode.x += delta.x;
        if (this.moveNode.x > 100) {
            this.moveNode.x = 100;
        }
        if (this.moveNode.x < -100) {
            this.showRight();
            this.answerRight();
        }
    }

    // 触摸结束时判断是否回答正确
    private onTouchEnd() {
        if (this.moveNode.x >= 100) {
            this.moveNode.x = -75;
        }

    }
}

