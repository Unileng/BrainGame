import { _decorator, Component, EventTouch, Node, Vec3 } from 'cc';
import { BrainGameBase } from '../BrainGameBase';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainGameLevel18')
export class BrainGameLevel18 extends BrainGameBase {
    @property(Node)
    private answerNode: Node = null;   // 答案节点

    init(){
        super.init();
        this.answerNode.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.answerNode.angle = 20;
    }

    private onTouchMove(event: EventTouch){
         const delta = event.getDelta();
         this.answerNode.angle += (delta.x + delta.y) * 0.3;
         if((this.answerNode.angle >= -200 && this.answerNode.angle <= -170) || (this.answerNode.angle >= 170 && this.answerNode.angle <= 200)){
            this.answerRight();
            this.showRight();
         }
    }
}

