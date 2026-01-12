import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TouTiaoSidebar')
export class TouTiaoSidebar extends Component {
    @property(Node)
    protected openNode: Node = null;

    @property(Node)
    protected rewardNode: Node = null;

    @property(Node)
    protected okNode: Node = null;

    public onClose: (reward: boolean) => void = null;

    public init(info: { finish: boolean, isOk: boolean }) {
        this.openNode.active = !info.isOk && !info.finish;
        this.rewardNode.active = !info.isOk && info.finish;
        this.okNode.active = info.isOk
    }

    protected choseOpenSidebar() {
        tt.navigateToScene && tt.navigateToScene({
            scene: "sidebar",
            fail: (res) => {
                console.warn(res);
            }
        })
        this.close();
    }

    protected choseReward() {
        this.close(true);
    }

    private onBtnClose(): void {
        this.close();
    }

    protected close(reward: boolean = false) {
        if (reward) {
            this.onClose && this.onClose(reward);
        }
        this.node.active = false;
        this.scheduleOnce(() => this.node.destroy());
    }
}

