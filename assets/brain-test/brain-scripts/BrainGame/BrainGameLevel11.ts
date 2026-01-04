import { _decorator, Component, EPhysics2DDrawFlags, Node, PhysicsSystem2D } from 'cc';
import { BrainGameBase } from '../BrainGameBase';
import { BrainGameTouchMoveCom } from '../BrainGameTouchMoveCom';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainGameLevel11')
export class BrainGameLevel11 extends BrainGameBase {
    @property(BrainGameTouchMoveCom)
    private answerTouchMoveCom: BrainGameTouchMoveCom = null;   // 答案触摸移动组件

    @property(Node)
    private answerNode: Node = null;   // 答案节点



    init(){
        super.init();
        this.answerTouchMoveCom.onColliderCB = this.onAnswerColliderCB.bind(this);
        this.answerNode.on(Node.EventType.TOUCH_END, this.onAnswerClick, this);
        this.answerNode.getChildByName('right').active = false;
        this.answerNode.getChildByName('show').active = true;
    }

    hide(): void {
        super.hide();
        this.answerNode.off(Node.EventType.TOUCH_END, this.onAnswerClick, this);
    }

    private onAnswerClick(){
        if( this.answerNode.getChildByName('right').active){
           this.showRight();
           this.answerRight();
        }
    }

    private onAnswerColliderCB(){
       this.answerNode.getChildByName('right').active = true;
       this.answerNode.getChildByName('show').active = false;
       this.answerTouchMoveCom.node.active = false;
    }
}

