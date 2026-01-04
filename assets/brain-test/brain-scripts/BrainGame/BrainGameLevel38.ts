import { _decorator, Component, Node } from 'cc';
import { BrainGameBase } from '../BrainGameBase';
import { BrainGameTouchMoveCom } from '../BrainGameTouchMoveCom';
const { ccclass, property } = _decorator;

//火柴点蜡烛
@ccclass('BrainGame/BrainGameLevel38')
export class BrainGameLevel38 extends BrainGameBase {
    @property(BrainGameTouchMoveCom)        //火柴
    private match: BrainGameTouchMoveCom = null;

    @property(BrainGameTouchMoveCom)        //蜡烛1
    private candle1: BrainGameTouchMoveCom = null;

    @property(BrainGameTouchMoveCom)        //蜡烛2
    private candle2: BrainGameTouchMoveCom = null;

    @property(BrainGameTouchMoveCom)        //蜡烛3
    private candle3: BrainGameTouchMoveCom = null;

    init() {
        super.init();
        this.showFireType(this.match.node, true);
        this.showFireType(this.candle1.node, false);
        this.showFireType(this.candle2.node, false);
        this.showFireType(this.candle3.node, false);
        this.candle1.onColliderCB = this.onCandleTouchMove.bind(this);
        this.candle2.onColliderCB = this.onCandleTouchMove.bind(this);
        this.candle3.onColliderCB = this.onCandleTouchMove.bind(this);
    }

    private onCandleTouchMove(selfCollider: Node, otherCollider: Node): void {
        console.log("onCandleTouchMove", selfCollider, otherCollider);
        if (otherCollider === this.match.node && this.match.node.getChildByName("1").active) {  //如果匹配到火柴且火柴上的2是激活状态
            this.showFireType(this.match.node, false);
            this.showFireType(selfCollider, true);
            selfCollider.getComponent(BrainGameTouchMoveCom).isActice = true;
        }
        if (otherCollider === this.candle2.node && this.candle2.node.getChildByName("1").active) {  //如果匹配到蜡烛2且蜡烛2上的1是激活状态
            this.showFireType(selfCollider, true);
        }
        if (otherCollider === this.candle3.node && this.candle3.node.getChildByName("1").active) {  //如果匹配到蜡烛3且蜡烛3上的1是激活状态
            this.showFireType(selfCollider, true);
        }
        if (otherCollider === this.candle1.node && this.candle1.node.getChildByName("1").active) {  //如果匹配到蜡烛1且蜡烛1上的1是激活状态
            this.showFireType(selfCollider, true);
        }

        this.checkAnswer();
    }


    private checkAnswer() {
        let fireCount = 0;
        if (this.candle1.node.getChildByName("1").active) {
            fireCount++;
        }
        if (this.candle2.node.getChildByName("1").active) {
            fireCount++;
        }
        if (this.candle3.node.getChildByName("1").active) {
            fireCount++;
        }
        if (fireCount >= 2) {
            this.answerRight();
            this.showRight();
        }
    }

    showFireType(node: Node, showFireType: boolean): void {
       node.getChildByName("1").active = showFireType;
       node.getChildByName("2").active = !showFireType;
    }

}

