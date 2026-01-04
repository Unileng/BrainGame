import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainInputNum')
export class BrainInputNum extends Component {
    @property(Label)
    private numLabel: Label = null;

    private minNum: number = 0;
    private maxNum: number = 99;

    protected onLoad(): void {
        this.setNum(this.minNum);
    }

    public setNum(num: number) {
        this.numLabel.string = num.toString();
    }

    public getNum() {
        return parseInt(this.numLabel.string);
    }

    private onBtnAdd() {
        if (this.getNum() >= this.maxNum) {
            return;
        }
        this.setNum(this.getNum() + 1);
    }

    private onBtnSub() {
        if (this.getNum() <= this.minNum) {
            return;
        }
        this.setNum(this.getNum() - 1);
    }
}

