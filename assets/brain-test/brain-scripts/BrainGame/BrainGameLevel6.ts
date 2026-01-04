import { _decorator, CCString, Component, Label, Node, Sprite } from 'cc';
import { BrainGameBase } from '../BrainGameBase';
import { BundleMgr } from '../BundleMgr';
const { ccclass, property } = _decorator;

//依次顺序点击数字
@ccclass('BrainGame/BrainGameLevel6')
export class BrainGameLevel6 extends BrainGameBase {
    @property(Node)
    private tipTitle: Node = null;

    @property([Node])
    private answers: Node[] = [];

    @property(CCString)
    private tipContent: string = "";

    private clickCount: number = 0;

    public init(): void {
        super.init();
        this.tipTitle.active = true;
        let answer = this.tipContent.split(",");
        if (answer.length != this.answers.length) {
            console.error("tipContent error");
            return;
        }
        this.tipTitle.getComponent(Label).string = this.tipContent;
        this.answers.forEach((node, index) => {
            node.on(Node.EventType.TOUCH_END, this.onAnswerClick.bind(this, node));
            node.getChildByName("num").getComponent(Label).string = answer[index];
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
        this.tipTitle.active = true;
        this.answers.forEach((node) => {
            node.getChildByName("numbg").active = false;
        });
    }

    private onAnswerClick(node: Node) {
        if (node.getChildByName("numbg").active) {  //已经点击过了
            return;
        }
        if (this.tipTitle.active) {
            this.tipTitle.active = false;
        }
        this.clickCount++;
        // node.getChildByName("numbg").getComponent(Sprite).spriteFrame = 
        this.loadNumber(node.getChildByName("numbg").getComponent(Sprite));
        node.getChildByName("numbg").getChildByName("num").getComponent(Label).string = `${this.clickCount}`;
        node.getChildByName("numbg").active = true;
    }

    async loadNumber(spr: Sprite) {
        BundleMgr.ins().setSprite(spr, "brain-res", `res/number/number-${this.clickCount}/spriteFrame`)
    }

    private onBtnCommitClick() {
        if (!this.checkAnswer()) {
            this.showError();
            this.hideAllClick();
            return;
        }
        this.showRight();
        this.answerRight();
    }

    private checkAnswer(): boolean {
        let isRight = true;
        this.answers.forEach((node, index) => {
            if (node.getChildByName("numbg").getChildByName("num").getComponent(Label).string != (index + 1).toString()) {
                isRight = false;
                return;
            }
        });

        return isRight;
    }

}

