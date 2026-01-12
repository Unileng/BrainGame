import { _decorator, AssetManager, assetManager, Component, find, instantiate, Node, Prefab, sys } from 'cc';
import { BrainGameData } from '../brain-test/brain-scripts/BrainGameData';
import { EventDef } from '../brain-test/brain-scripts/EventDef';
import { EventManager } from '../brain-test/brain-scripts/EventManager';
import { TouTiaoSidebar } from './TouTiaoSidebar';
const { ccclass, property } = _decorator;
const enum SRState {
    None = "None1",
    Finish = "Finish1",
    Rewarded = "Rewarded1",
}
@ccclass('TouTiaoButtonSidebar')
export class TouTiaoButtonSidebar extends Component {
    @property(Node)
    private redPoint: Node = null;

    private _state: string = '';

    private SRStateKey: string = 'TouTiaoButtonSidebarState';

    protected set state(state: string) {
        this._state = state;
        this.setItem(this.SRStateKey, state);
    }

    protected get state() {
        return this._state;
    }

    protected onLoad(): void {
        if (sys.platform != sys.Platform.BYTEDANCE_MINI_GAME && !sys.isBrowser) {
            this.node.active = false;
        }
        this.state = this.getItem(this.SRStateKey, SRState.None);
        this.checkSupportSideBar();
        this.checkLaunchFromSideBar();
    }

    public setItem(key: string, value: string) {
        sys.localStorage.setItem(key, value);
    }

    public getItem(key: string, defaultValue: string = null): string {
        let item: string = sys.localStorage.getItem(key);
        if (item == null || item == "") {
            return defaultValue;
        }
        return item;
    }

    /**
   * 检测宿主是否支持从侧边栏启动
   * @protected
   */
    protected checkSupportSideBar() {
        if (sys.platform !== sys.Platform.BYTEDANCE_MINI_GAME) {
            return;
        }
        tt.checkScene && tt.checkScene({
            scene: "sidebar",
            success: (res) => {
                console.log("check scene success: ", res.isExist);
                if (res.isExist) {
                    this.showBtnCheck();
                } else {
                    this.hide();
                }
            },
            fail: (res) => {
                console.log("check scene fail:", res);
            }
        });
    }

    /**
    * 检查游戏是否从宿主机启动
    * @protected
    */
    protected checkLaunchFromSideBar() {
        tt.onShow((res) => {
            if (res.launch_from && (res.launch_from == "sidebar_card" || res.launch_from == "homepage_expand")) {
                this.state = SRState.Finish;
            }
        })
    }

    // 正确从侧边栏启动游戏，获得奖励
    protected finishSidebarReward() {
        // 奖励钻石+100
        this.state = SRState.Rewarded;
        BrainGameData.tipCardCount += BrainGameData.shareGetCount;
        EventManager.emit(EventDef.BRAINGAME_EVT_UPDATE_TOOL_COUNT);    // 更新工具数量广播
        this.hide();
    }

    protected chooseSelf() {
        this.redPoint.active = false;
        assetManager.loadBundle("toutiao", (err, bundle: AssetManager.Bundle) => {
            if (err) {
                return
            }
            bundle.load("prefab/TouTiaoSidebar", Prefab, (err, assest: Prefab) => {
                let node = instantiate(assest);
                node.parent = find("Canvas");
                const view = node.getComponent(TouTiaoSidebar);
                view.init({ finish: this.state == SRState.Finish, isOk: this.state == SRState.Rewarded });
                view.onClose = (reward) => {
                    if (reward) {
                        this.finishSidebarReward();
                    }
                }
            })

        });
    }

    private hide() {
        this.node.active = false;
    }

    /**
     * 是否展示奖励入口
     * @protected
     */
    protected showBtnCheck() {
        if (this.state === SRState.Rewarded) {
            // this.hide();
        } else if (this.state === SRState.None) {
            this.redPoint.active = false;
        } else {
            this.redPoint.active = true;
        }
    }
}

