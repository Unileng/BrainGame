import { _decorator, Component, Node } from 'cc';
import { BrainGameBase } from '../BrainGameBase';
import { BrainGameTouchMoveCom } from '../BrainGameTouchMoveCom';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainGameLevel34')
export class BrainGameLevel34 extends BrainGameBase {
    @property([Node])
    private answerNodes: Node[] = [];

    @property(BrainGameTouchMoveCom)
    private touchMoveCom: BrainGameTouchMoveCom = null;

    init() {
        super.init();
        this.touchMoveCom.isActice = true;
        this.touchMoveCom.onColliderCB = this.onColliderCB.bind(this);
    }

    private onColliderCB(selfCollider: Node, otherCollider: Node): void {
        if(this.isAnswerRight){
            return;
        }
        for (let i = 0; i < this.answerNodes.length; i++) {
            const element = this.answerNodes[i];
            if (element == otherCollider) { 
                element.getChildByName("right").active = true;
                element.getChildByName("wrong").active = false;
                this.answerRight();
                this.showRight(element.getPosition());
                return;
            }
            
        }
    }

}

