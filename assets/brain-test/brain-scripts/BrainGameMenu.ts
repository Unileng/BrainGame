import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainGameMenu')
export class BrainGameMenu extends Component {
   @property(Label)
   private btnLabel: Label = null;

   @property(Label)
   private infoLabel: Label = null;

   clickCB: Function = null;

   initUI(btnText: string = "准 备", infoText: string = "测试你的智商！") {
      this.btnLabel.string = btnText;
      this.infoLabel.string = infoText;
   }

   onBtnClick() {
        this.clickCB?.();
   }
}

