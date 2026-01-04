import { _decorator, Component, Label, Node } from 'cc';
import { BrainGameBase } from '../BrainGameBase';
import { BrainGameTouchMoveCom } from '../BrainGameTouchMoveCom';
import { BrainGameData } from '../BrainGameData';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainGameLevel26')
export class BrainGameLevel26 extends BrainGameBase {
    @property({ type: BrainGameTouchMoveCom, displayName: '数字1', })
    protected num1: BrainGameTouchMoveCom = null;

    @property({ type: BrainGameTouchMoveCom, displayName: '数字2', })
    protected num2: BrainGameTouchMoveCom = null;

    @property({ type: Label, displayName: '答案', })
    protected answer: Label = null;

    @property({ type: Label, displayName: '题干1', })
    protected stem1: Label = null;

    @property({ type: Label, displayName: '题干2', })
    protected stem2: Label = null;

    private answerChange = [false, false];

    // 初始化
    init() {
        super.init();
        this.num1.onColliderCB = this.onNum1ColliderCB.bind(this);
        this.num2.onColliderCB = this.onNum2ColliderCB.bind(this);
        BrainGameData.menuTitle.active = false;
    }

    onNum1ColliderCB(self: Node, other: Node) {
        if (other == this.stem1.node.parent && !this.answerChange[0]) {
            this.stem1.string = this.num1.node.getComponentInChildren(Label).string;
            self.active = false;
            this.answerChange[0] = true;
        }
        if (other == this.stem2.node.parent && !this.answerChange[1]) {
            this.stem2.string = this.num1.node.getComponentInChildren(Label).string;
            self.active = false;
            this.answerChange[1] = true;
        }
         this.checkAnswer();
    }

    onNum2ColliderCB(self: Node, other: Node) {
        if (other == this.stem1.node.parent && !this.answerChange[0]) {
            this.stem1.string = this.num2.node.getComponentInChildren(Label).string;
            self.active = false;
            this.answerChange[0] = true;
        }
        if (other == this.stem2.node.parent && !this.answerChange[1]) {
            this.stem2.string = this.num2.node.getComponentInChildren(Label).string;
            self.active = false;
            this.answerChange[1] = true;
        }
        this.checkAnswer();
       
    }

    private checkAnswer(): void {
        if (this.answerChange[0] && this.answerChange[1]) {
           this.answerRight();
           this.showRight();
        }
    }


    hide(): void {
        BrainGameData.menuTitle.active = true;
        super.hide();
   }

   protected onDisable(): void {
       BrainGameData.menuTitle.active = true;
   }

   protected onEnable(): void {
       BrainGameData.menuTitle.active = false;
   }
}

