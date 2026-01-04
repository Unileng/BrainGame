import { _decorator, CCBoolean, Color, Component, Node, Sprite, Tween, tween, Vec3 } from 'cc';
import { EventManager } from './EventManager';
import { EventDef } from './EventDef';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainGameBase')
export class BrainGameBase extends Component {
    @property({ type: Node, displayName: '正确展示图', })
    protected rightShow: Node = null;

    @property({ type: Node, displayName: '错误展示图', })
    protected errorShow: Node = null;

    @property({ type: Node, displayName: '新手提示', })
    protected tipShow: Node = null;

    protected isAnswerRight: boolean = false;

    protected onLoad(): void {
        if(this.rightShow) this.rightShow.active = false;
        if(this.errorShow) this.errorShow.active = false;
        this.init();
    }

    init() {
        if(this.tipShow){
            this.tipShow.active = false;
            this.scheduleOnce(() => {
                this.showTip();
            }, 2);
        }
      
    }

    hide() {
        this.node.destroy();
    }

    answerRight() {
        if(this.isAnswerRight){
            return;
        }
        this.isAnswerRight = true;
        tween(this.node)
            .delay(1)
            .call(() => {
                this.hide();
                EventManager.emit(EventDef.BRAINGAME_EVT_ANSWER_RIGHT);    // 回答正确广播
            })
            .start();
    }

    public showTip(): void {
        this.tipShow.active = true;
    }

    protected showRight(pos?: Vec3): void {
        if(!this.rightShow) return;
        if (pos) {
            this.rightShow.setPosition(pos);
        }
        Tween.stopAllByTarget(this.rightShow);
        this.rightShow.active = true;
        this.rightShow.getComponent(Sprite).color = new Color(255, 255, 255, 0);
        tween(this.rightShow.getComponent(Sprite))
            .to(0.5, { color: new Color(255, 255, 255, 255) })
            .start();
    }

    protected showError(pos?: Vec3): void {
        if(!this.errorShow) return;
        if (pos) {
            this.errorShow.setPosition(pos);
        }
        Tween.stopAllByTarget(this.errorShow);
        this.errorShow.active = true;
        this.errorShow.getComponent(Sprite).color = new Color(255, 255, 255, 0);
        tween(this.errorShow.getComponent(Sprite))
            .to(0.5, { color: new Color(255, 255, 255, 255) })
            .delay(0.5)
            .call(() => {
                this.errorShow.active = false;
            })
            .start();
    }
}

