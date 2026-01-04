import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BrainKeyBoradNum')
export class BrainKeyBoradNum extends Component {

    public clickNumberCB: (index: number) => void = null;

    protected onLoad(): void {
        this.node.children.forEach((item, index) => {
            item.on(Node.EventType.TOUCH_END, () => {
                this.onBtnClick(index);
            }, this);
        })
    }

    protected onBtnClick(index: number): void {
        if (this.clickNumberCB) {
            this.clickNumberCB(index);
        }
    }
}

