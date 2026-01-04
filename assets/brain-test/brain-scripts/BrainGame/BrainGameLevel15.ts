import { _decorator, Color, Component, Node, Sprite, tween, Tween } from 'cc';
import { BrainGameBase } from '../BrainGameBase';
import { BrainGameData } from '../BrainGameData';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainGameLevel15')
export class BrainGameLevel15 extends BrainGameBase {
    @property(Node)
    private answerNode: Node = null;

    @property(Node)
    private blackNode: Node = null;
    init() {
        super.init();
        if (BrainGameData.menuLight) {
            BrainGameData.menuLight.isActice = true;
            BrainGameData.menuLight.onColliderCB = this.onColliderCB.bind(this);
        }

    }

    hide(): void {
        super.hide();
        if (BrainGameData.menuLight) BrainGameData.menuLight.isActice = false;
    }

    /**
     * 碰撞检测回调
     */
    private onColliderCB(selfCollider: Node, otherCollider: Node) {
        console.log("onColliderCB", selfCollider, otherCollider);
        if (otherCollider === this.answerNode) {
            this.showRight();
        }
    }

    protected showRight(): void {
        Tween.stopAllByTarget(this.blackNode);
        console.log("showRight");
        tween(this.blackNode.getComponent(Sprite))
            .to(0.5, { color: new Color(255, 255, 255, 0) })
            .call(() => {
                super.showRight();
                this.answerRight();
            })
            .start();
    }
}

