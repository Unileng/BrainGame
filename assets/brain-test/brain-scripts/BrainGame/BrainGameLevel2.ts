import { _decorator, CCInteger, Color, Component, Label, Node, Sprite, tween, Tween } from 'cc';
import { BrainKeyBoradNum } from './BrainKeyBoradNum';
import { BrainGameBase } from '../BrainGameBase';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainGameLevel2')
export class BrainGameLevel2 extends BrainGameBase {
    @property({ type: BrainKeyBoradNum, displayName: '数字键盘', })
    keyBoradNum: BrainKeyBoradNum = null;

    @property({ type: Label, displayName: '数字键盘的输入点', })
    keyBoradNumLabel: Label = null;

    @property({ type: CCInteger, displayName: '输入的数字位数', })
    inputMaxNumCount: number = 0;

    @property({ type: CCInteger, displayName: '正确答案', })
    rightAnswer: number = 0;

    private currentNumCount: number = 0;

    private inputNum: number = 0;
    
    init() {
        super.init();
        this.keyBoradNum.clickNumberCB = this.onBtnClickNumber.bind(this);
        this.keyBoradNumLabel.string = '';
    }

    private onBtnClickNumber(index: number): void {
        if (this.currentNumCount >= this.inputMaxNumCount) {
            return;
        }
        this.currentNumCount++;
        this.keyBoradNumLabel.string += index.toString();
        this.inputNum = this.inputNum * 10 + index;
    }

    private onBtnClickRight(): void {
        if(this.inputNum == this.rightAnswer) {
            this.showRight();
            this.answerRight();
        } else {
            this.showError();
            this.currentNumCount = 0;
            this.inputNum = 0;
            this.keyBoradNumLabel.string = '';
        }
    }

    private onBtnClickError(): void {
        this.currentNumCount = 0;
        this.inputNum = 0;
        this.keyBoradNumLabel.string = '';
    }
}

