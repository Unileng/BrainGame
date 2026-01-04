import { _decorator, CCInteger, Component, Node } from 'cc';
import { BrainGameBase } from '../BrainGameBase';
import { BrainInputNum } from './BrainInputNum';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainGameLevel14')
export class BrainGameLevel14 extends BrainGameBase {
    @property(CCInteger)
    private answerNum: number = 0;

    @property(BrainInputNum)
    private inputNum: BrainInputNum = null;

    init() {
        super.init();
    }

    private onBtnSubmit(){
        if(this.inputNum.getNum() == this.answerNum){
            this.showRight();
            this.answerRight();
        }else{
            this.inputNum.setNum(0);
            this.showError();
        }
    }
}

