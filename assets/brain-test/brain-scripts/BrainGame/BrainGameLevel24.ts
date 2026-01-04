import { _decorator, Component, Node, UITransform } from 'cc';
import { BrainGameBase } from '../BrainGameBase';
const { ccclass, property } = _decorator;

//描述：第24关，灯泡开关游戏
@ccclass('BrainGame/BrainGameLevel24')
export class BrainGameLevel24 extends BrainGameBase {
    @property({ type: Node, displayName: '灯泡1', })
    light1: Node = null;

    @property({ type: Node, displayName: '灯泡2', })
    light2: Node = null;

    @property({ type: Node, displayName: '灯泡3', })
    light3: Node = null;

    @property({ type: Node, displayName: '开关1', })
    sw1: Node = null;

    @property({ type: Node, displayName: '开关2', })
    sw2: Node = null;

    @property({ type: Node, displayName: '开关3', })
    sw3: Node = null;

    @property({ type: Node, displayName: '开关4', })
    sw4: Node = null;

    private swStatus: boolean[] = [false, false, false, false];

    private lightStatus: boolean[] = [false, false, false];

    init(): void {
        super.init();
        this.sw1.on(Node.EventType.TOUCH_END, this.onBtnOpenLight1, this);
        this.sw2.on(Node.EventType.TOUCH_END, this.onBtnOpenLight2, this);
        this.sw3.on(Node.EventType.TOUCH_END, this.onBtnOpenLight3, this);
        this.sw4.on(Node.EventType.TOUCH_END, this.onBtnOpenLight4, this);
        this.switchClose(this.sw1, false);
        this.switchClose(this.sw2, false);
        this.switchClose(this.sw3, false);
        this.switchClose(this.sw4, false);
        this.lightSwitch(this.light1, false);
        this.lightSwitch(this.light2, false);
        this.lightSwitch(this.light3, false);
        this.schedule(this.checkAnswer, 1);
    }

    hide(): void {
        super.hide();
        this.sw1.off(Node.EventType.TOUCH_END, this.onBtnOpenLight1, this);
        this.sw2.off(Node.EventType.TOUCH_END, this.onBtnOpenLight2, this);
        this.sw3.off(Node.EventType.TOUCH_END, this.onBtnOpenLight3, this);
        this.sw4.off(Node.EventType.TOUCH_END, this.onBtnOpenLight4, this);
    }

    onBtnOpenLight1() {
        this.lightSwitch(this.light1, !this.lightStatus[0]);
        this.lightSwitch(this.light3, false);
        this.switchClose(this.sw1, !this.swStatus[0]);
    }

    onBtnOpenLight2() {
        this.lightSwitch(this.light1, !this.lightStatus[0]);
        this.lightSwitch(this.light2, !this.lightStatus[1]);
        this.lightSwitch(this.light3, false);
        this.switchClose(this.sw2, !this.swStatus[1]);
    }

    onBtnOpenLight3() {
        this.lightSwitch(this.light2, !this.lightStatus[1]);
        this.lightSwitch(this.light3, false);
        this.switchClose(this.sw3, !this.swStatus[2]);
    }

    onBtnOpenLight4() {
        this.lightSwitch(this.light1, this.lightStatus[2]);
        this.lightSwitch(this.light2, this.lightStatus[2]);
        this.lightSwitch(this.light3, !this.lightStatus[2]);
        this.switchClose(this.sw4, !this.swStatus[3]);
    }

    private lightSwitch(light: Node, isOn: boolean) {
        this.lightStatus[light.name === 'light1' ? 0 : light.name === 'light2' ? 1 : 2] = isOn;
        light.getChildByName('light').active = isOn;
        light.getChildByName('close').active = !isOn;
        this.checkAnswer();
    }

    private switchClose(switchNode: Node, isClose: boolean) {
        switchNode.getChildByName('close').y = isClose ? 0 : 2;
        this.swStatus[switchNode.name === 'sw1' ? 0 : switchNode.name === 'sw2' ? 1 : switchNode.name === 'sw3' ? 2 : 3] = isClose;
    }

    checkAnswer() {
        let winSize = this.node.getComponent(UITransform).contentSize;
        if(this.light3.position.y < winSize.height / 2 && this.light3.position.y > -winSize.height / 2 && this.light3.position.x < winSize.width / 2 && this.light3.position.x > -winSize.width / 2) {
            return
        }
        if (this.lightStatus[0] && this.lightStatus[1]) {
            this.answerRight();
            this.showRight();
        } 
    }
}

