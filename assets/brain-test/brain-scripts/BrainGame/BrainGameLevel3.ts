import { _decorator, Color, Component, EventTouch, Node, Sprite, tween, Tween, Vec3 } from 'cc';
import { BrainGameBase } from '../BrainGameBase';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainGameLevel3')
export class BrainGameLevel3 extends BrainGameBase {
    @property({ type: [Node], displayName: '错误的节点们', })
    private errAnimNodes: Node[] = [];   // 动物们

    @property({ type: Node, displayName: '正确的节点', })
    protected rightAni: Node = null;

    init() {
        super.init();
        this.errAnimNodes.forEach((node) => {
           node.on(Node.EventType.TOUCH_END, this.onErrAniClick, this);
        });
        this.rightAni.on(Node.EventType.TOUCH_END, this.onRightAniClick, this);
    }

    protected onErrAniClick(event: EventTouch): void {
        this.showError(event.target.getPosition());
    }

    protected onRightAniClick(event: EventTouch): void {
        this.showRight();
        this.answerRight();
    }

    hide() {
        super.hide();
        this.errAnimNodes.forEach((node) => {
            node.off(Node.EventType.TOUCH_END, this.onErrAniClick, this);
        });
        this.rightAni.off(Node.EventType.TOUCH_END, this.onRightAniClick, this);
    }
}

