import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BrainInputText')
export class BrainInputText extends Component {
    protected onLoad(): void {
        this.clear();
    }

    init(num: number) {
        let numStr = num.toString();
        for(let i = 0; i < this.node.children.length; i++) {
            let node = this.node.children[i];
            node.getChildByName('num').getComponent(Label).string = numStr[i];
        }
    }

    clear() {
        for(let i = 0; i < this.node.children.length; i++) {
            let node = this.node.children[i];
            node.getChildByName('num').getComponent(Label).string = '';
        }
    }
}

