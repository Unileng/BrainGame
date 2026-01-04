import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { BrainGameBase } from '../BrainGameBase';
import { BundleMgr } from '../BundleMgr';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainGameLevel19')
export class BrainGameLevel19 extends BrainGameBase {

    @property([Node])
    private answers: Node[] = [];

    private clickCount: number = 0;

    public init(): void {
        super.init();
        this.answers.forEach((node, index) => {
            node.on(Node.EventType.TOUCH_END, this.onAnswerClick.bind(this, node));
        });
        this.hideAllClick();
    }

    public hide(): void {
        super.hide();
        this.answers.forEach((node) => {
            node.off(Node.EventType.TOUCH_END, this.onAnswerClick, this);
        });
    }

    //取消之前的点击次数
    private hideAllClick(): void {
        this.clickCount = 0;
        this.answers.forEach((node) => {
            node.getChildByName("numbg").active = false;
        });
    }

    private onAnswerClick(node: Node) {
        if (node.getChildByName("numbg").active) {  //已经点击过了
            return;
        }
        this.clickCount++;
        // node.getChildByName("numbg").getComponent(Sprite).spriteFrame = 
        this.loadNumber(node.getChildByName("numbg").getComponent(Sprite));
        node.getChildByName("numbg").getChildByName("num").getComponent(Label).string = `${this.clickCount}`;
        node.getChildByName("numbg").active = true;
        this.checkAnswer();
    }

    async loadNumber(spr: Sprite) {
        BundleMgr.ins().setSprite(spr, "brain-res", `res/number/number-${this.clickCount}/spriteFrame`)
    }

    private checkAnswer(): void {
        if (this.clickCount != this.answers.length) {
            return;
        }
        let isRight = true;
        this.answers.forEach((node, index) => {
            if (node.getChildByName("numbg").getChildByName("num").getComponent(Label).string != (index + 1).toString()) {
                isRight = false;
                return;
            }
        });
        if(isRight){
            this.showRight();
            this.answerRight();
        }else{
            this.showError();
            this.hideAllClick();
        }
    }

}


