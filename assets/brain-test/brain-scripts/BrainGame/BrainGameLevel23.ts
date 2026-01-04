import { _decorator, Component, EventTouch, Node } from 'cc';
import { BrainGameBase } from '../BrainGameBase';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainGameLevel23')
export class BrainGameLevel23 extends BrainGameBase {

    @property({ type: Node, displayName: '点击的节点', })
    private clickNode: Node = null;

    private cdTime: number = 0;

    private maxCdTime: number = 10;

    private isStartTime: boolean = false;

    init() {
        super.init();
        this.isStartTime = true;
        this.clickNode.on(Node.EventType.TOUCH_END, this.onClickNodeClick, this);
    }

    hide() {
        super.hide();
        this.clickNode.off(Node.EventType.TOUCH_END, this.onClickNodeClick, this);
    }

    protected update(dt: number): void {
        if (this.isStartTime) {
            this.cdTime += dt;
            if (this.cdTime >= this.maxCdTime) {
                this.showRight();
                this.answerRight();
            }
        }
    }

    private onClickNodeClick(event: EventTouch): void {
        this.cdTime = 0;
    }
}

