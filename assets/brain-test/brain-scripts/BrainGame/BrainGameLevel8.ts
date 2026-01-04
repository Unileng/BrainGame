import { _decorator, CCInteger, Color, Component, Label, Node, Sprite, tween, Tween } from 'cc';
import { BrainKeyBoradNum } from './BrainKeyBoradNum';
import { BrainGameBase } from '../BrainGameBase';
import { BrainInputText } from './BrainInputText';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainGameLevel8')
export class BrainGameLevel8 extends BrainGameBase {
    @property({ type: BrainKeyBoradNum, displayName: '数字键盘', })
    keyBoradNum: BrainKeyBoradNum = null;

    @property({ type: BrainInputText, displayName: '数字键盘的输入点', })
    keyBoradNumLabel: BrainInputText = null;

    @property({ type: CCInteger, displayName: '输入的数字位数', })
    inputMaxNumCount: number = 0;

    @property({ type: CCInteger, displayName: '正确答案', })
    rightAnswer: number = 0;

    private currentNumCount: number = 0;

    private inputNum: number = 0;
    
    init() {
        super.init();
        this.keyBoradNum.clickNumberCB = this.onBtnClickNumber.bind(this);
        this.keyBoradNumLabel.clear();
    }

    private onBtnClickNumber(index: number): void {
        if (this.currentNumCount >= this.inputMaxNumCount) {
            return;
        }
        this.currentNumCount++;
        this.inputNum = this.inputNum * 10 + index;
        this.keyBoradNumLabel.init(this.inputNum);
    }

    private onBtnClickRight(): void {
        if(this.inputNum == this.rightAnswer) {
            this.showRight();
            this.answerRight();
        } else {
            this.showError();
            this.currentNumCount = 0;
            this.inputNum = 0;
            this.keyBoradNumLabel.clear();
        }
    }

    private onBtnClickError(): void {
        this.currentNumCount = 0;
        this.inputNum = 0;
        this.keyBoradNumLabel.clear();
    }
}

