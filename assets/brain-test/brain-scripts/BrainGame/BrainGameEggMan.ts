import { _decorator, Component, EventTouch, Node, tween, Tween, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainGameEggMan')
export class BrainGameEggMan extends Component {
    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchEnd() {
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        Tween.stopAllByTarget(this.node);
        tween(this.node)
            .to(0.5, { position: v3(this.node.x, this.node.y + 100, 0) })
            .start();
    }
}

