import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { BrainGameBase } from '../BrainGameBase';
import { BundleMgr } from '../BundleMgr';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainGameLevel37')
export class BrainGameLevel37 extends BrainGameBase {
    @property([Node])
    private answerNodes: Node[] = [];

    @property(Node)
    private errNode: Node = null;

    private clickCount = 0;
    init() {
        super.init();
        this.answerNodes.forEach((node, i) => {
            node.on(Node.EventType.TOUCH_END, () => { this.onAnswerClick(i); }, this);
        });
        this.errNode.on(Node.EventType.TOUCH_END, () => { this.onErrClick(); }, this);
        this.hideAllClick();
    }

    private hideAllClick(): void {
        this.clickCount = 0;
        this.errNode.getChildByName("numbg").active = false;
        this.answerNodes.forEach((node) => {
            node.getChildByName("numbg").active = false;
            node.getChildByName("numbg").getChildByName("num").getComponent(Label).string = "";
        });
    }

    private onErrClick() {
        if( this.errNode.getChildByName("numbg").active){
            return;
        }
        this.clickCount++;
        this.errNode.getChildByName("numbg").active = true;
        this.errNode.getChildByName("numbg").getChildByName("num").getComponent(Label).string = `${this.clickCount}`;
        this.loadNumber(this.errNode.getChildByName("numbg").getComponent(Sprite));
    }

    private onAnswerClick(index: number) {
        let node = this.answerNodes[index];
        if (node.getChildByName("numbg").active) {  //已经点击过了
            return;
        }
        this.clickCount++;
        this.loadNumber(node.getChildByName("numbg").getComponent(Sprite));
        node.getChildByName("numbg").getChildByName("num").getComponent(Label).string = `${this.clickCount}`;
        node.getChildByName("numbg").active = true;
    }

    async loadNumber(spr: Sprite) {
        BundleMgr.ins().setSprite(spr, "brain-res", `res/number/number-${this.clickCount}/spriteFrame`)
    }

    private checkAnswer(): boolean {
        let isRight = true;
        this.answerNodes.forEach((node, index) => {
            if (node.getChildByName("numbg").getChildByName("num").getComponent(Label).string != `${index + 1}`) {
                isRight = false;
                return;
            }
        });
        if (this.errNode.getChildByName("numbg").active) {
            isRight = false;
        }
        return isRight;
    }

    private onBtnSubmit() {
        if (this.checkAnswer()) {
            this.showRight();
            this.answerRight();
        } else {
            this.showError();
            this.hideAllClick();
        }
    }
}

