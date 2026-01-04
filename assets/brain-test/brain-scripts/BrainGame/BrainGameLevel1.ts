import { _decorator, Color, Component, Node, Sprite, SpriteFrame, tween, Tween } from 'cc';
import { BrainGameTouchMoveCom } from '../BrainGameTouchMoveCom';
import { BrainGameBase } from '../BrainGameBase';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainGameLevel1')
export class BrainGameLevel1 extends BrainGameBase {
    @property(BrainGameTouchMoveCom)
    private answerTouchMoveCom: BrainGameTouchMoveCom = null;   // 答案区域的触摸移动组件

    @property(SpriteFrame)
    private answerSpriteFrame: SpriteFrame = null;   // 答案区域的精灵帧

    @property(SpriteFrame)
    private correctSpriteFrame: SpriteFrame = null;   // 正确答案的精灵帧

    @property(SpriteFrame)
    private npcSpriteFrame: SpriteFrame = null;   // 答案区域的精灵帧

    @property(SpriteFrame)
    private correctNpcSpriteFrame: SpriteFrame = null;   // 正确答案的精灵帧

    @property(Sprite)
    private answerSprite: Sprite = null;   // 答案区域的精灵组件

    @property(Sprite)
    private npcSprite: Sprite = null;   // 答案区域的精灵组件

    init() {
        super.init();
        this.answerTouchMoveCom.onColliderCB = this.onAnswerColliderCB.bind(this);
        this.npcSprite.spriteFrame = this.npcSpriteFrame;
        this.answerSprite.spriteFrame = this.answerSpriteFrame;
    }

    private onAnswerColliderCB(selfCollider: Node, otherCollider: Node) {
        if(this.isAnswerRight) return;
        if (otherCollider.name == 'Answer') {
            console.log('答案正确'); 
            this.showRight();
            this.answerRight();
        }
    }

    answerRight() {
        this.answerSprite.spriteFrame = this.correctSpriteFrame;
        this.npcSprite.spriteFrame = this.correctNpcSpriteFrame;
        super.answerRight();
    }
}

