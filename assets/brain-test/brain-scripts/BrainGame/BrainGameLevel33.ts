import { _decorator, Component, Node, Vec3 } from 'cc';
import { BrainGameBase } from '../BrainGameBase';
const { ccclass, property } = _decorator;

// 关卡33 红+绿 = 黄
@ccclass('BrainGame/BrainGameLevel33')
export class BrainGameLevel33 extends BrainGameBase {
    @property(Node)
    private greenNode: Node = null;

    @property(Node)
    private redNode: Node = null;

    @property(Node)
    private yellowNode: Node = null;

    init() {
        super.init();
        this.yellowNode.active = false;
        this.redNode.active = true;
        this.greenNode.active = true;
        this.schedule(this.checkAnswer, 0.02);
    }

    checkAnswer() {
        let distance = Vec3.distance(this.redNode.position, this.greenNode.position);
        if (distance < 10) {
            this.yellowNode.active = true;
            this.yellowNode.setPosition(this.redNode.position);
            this.redNode.active = false;
            this.greenNode.active = false;
            this.answerRight();
            this.showRight();
        }
    }
}

