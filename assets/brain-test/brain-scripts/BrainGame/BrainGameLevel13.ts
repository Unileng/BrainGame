import { _decorator, Component, Node } from 'cc';
import { BrainGameBase } from '../BrainGameBase';
import { BrainGameTouchMoveCom } from '../BrainGameTouchMoveCom';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainGameLevel13')
export class BrainGameLevel13 extends BrainGameBase {
    @property(BrainGameTouchMoveCom)
    private moveNode: BrainGameTouchMoveCom = null;

    @property(Node) //move 节点检测的正确区域
    private answerNode: Node = null;

    @property(Node) //正确节点
    private rightNode: Node = null;

    private canAnswer: boolean = false;

    init() {
        super.init();
        this.moveNode.onColliderCB = this.onMoveColliderCB.bind(this);
        this.moveNode.onEndContactCB = this.onEndContactCB.bind(this);
        this.rightNode.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchEnd(){
        if(!this.canAnswer) return;
        this.showRight();
        this.answerRight();
    }

    private onMoveColliderCB(self: Node, other: Node) {
        if (other === this.answerNode) {
            this.canAnswer = true;
        }
    }

    private onEndContactCB(self: Node, other: Node) {
        if (other === this.answerNode) {
            this.canAnswer = false;
        }
    }
}

