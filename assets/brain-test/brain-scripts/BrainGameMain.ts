import { _decorator, Component, EPhysics2DDrawFlags, instantiate, Label, Node, PhysicsSystem2D, sys, tween, Tween, Vec3 } from 'cc';
import { BrainLevelUI } from './BrainLevelUI';
import { BrainGameData, BrainGameLevelUrl, BrainGameUIType } from './BrainGameData';
import { BrainGameMenu } from './BrainGameMenu';
import { BundleMgr } from './BundleMgr';
import { EventManager } from './EventManager';
import { MsgHandlerComponent } from './MessageHandler';
import { EventDef } from './EventDef';
import { BrainGameTouchMoveCom } from './BrainGameTouchMoveCom';
import SdkManager from '../../scripts/SdkManager';
import { BrainGameSetting } from './BrainGameSetting';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainGameMain')
export class BrainGameMain extends MsgHandlerComponent {
    @property({ type: Node, displayName: '游戏场景中的按钮列表', })
    gameBtnList: Node = null;

    @property({ type: Node, displayName: '首页展示的按钮', })
    gameMenuBtn: Node = null;

    @property({ type: BrainGameMenu, displayName: '首页展示的信息', })
    uiMenu: BrainGameMenu = null;

    @property({ type: Label, displayName: '玩家的灯泡数量', })
    toolCount: Label = null;

    @property({ type: BrainLevelUI, displayName: '关卡UI', })
    levelUI: BrainLevelUI = null;

    @property({ type: Node, displayName: '游戏场景', })
    uigame: Node = null;

    @property({ type: Label, displayName: '游戏页面的介绍', })
    uiTitle: Label = null;

    @property({ type: BrainGameTouchMoveCom, displayName: '灯泡', })
    lightMoveCom: BrainGameTouchMoveCom = null;

    @property({ type: Node, displayName: '提示节点', })
    tipNode: Node = null;

    @property({ type: Node, displayName: 'logo', })
    logo: Label = null;

    @property({ type: BrainGameSetting, displayName: '设置界面', })
    settingNode: BrainGameSetting = null;

    onLoad() {
        super.onLoad();
        this.initUI();
        BrainGameData.initData();
        this.updateToolCount();
        this.levelUI.hide();
        this.settingNode.hide();

        AudioMgr.ins().playMusicFromBundle('brain-res', 'audio/bg');
        EventManager.on(EventDef.BRAINGAME_EVT_ANSWER_RIGHT, this.answerRight.bind(this));    // 回答正确广播
        EventManager.on(EventDef.BRAINGAME_EVT_ENTER, this.enterGame.bind(this));    // 进入游戏广播
        EventManager.on(EventDef.BRAINGAME_EVT_UPDATE_TOOL_COUNT, this.updateToolCount.bind(this));    // 更新工具数量广播
    }

    initUI() {
        //PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.All;
        this.uiMenu.node.active = BrainGameUIType.Menu == BrainGameData.uiType;
        this.uiMenu.initUI();
        this.uiMenu.clickCB = this.onBtnStartClick.bind(this);
        this.uigame.active = BrainGameUIType.Game == BrainGameData.uiType;
        this.gameMenuBtn.active = true;
        this.gameBtnList.active = BrainGameUIType.Game == BrainGameData.uiType;
        this.uiTitle.string = BrainGameUIType.Game == BrainGameData.uiType ? `当前关卡 ${BrainGameData.currentLevel}` : ``;
        this.lightMoveCom.isActice = false;
        this.tipNode.active = false;
        BrainGameData.menuLight = this.lightMoveCom;
        BrainGameData.menuTitle = this.uiTitle.node;
    }

    onBtnLevelClick() {
        this.uiMenu.node.active = false;
        this.gameMenuBtn.active = false;
        this.uigame.active = false;
        this.gameBtnList.active = false;
        this.uiTitle.string = `关卡`;
        this.levelUI.show(this.initUI.bind(this));
    }

    onBtnHomeClick() {
        if (BrainGameData.uiType == BrainGameUIType.Menu) {
            return;
        }
        BrainGameData.uiType = BrainGameUIType.Menu;
        this.initUI();
    }

    onBtnStartClick() {
        if (BrainGameData.uiType == BrainGameUIType.Game) {
            return;
        }
        this.enterGame();
    }

    onBtnToolClick() {
        if (BrainGameData.tipCardCount < BrainGameData.getTipCost) {
            this.showTip(`没有更多工具了,可以分享获取`);
            return;
        }
        BrainGameData.tipCardCount -= BrainGameData.getTipCost;
        let tip = BrainGameData.levelGameTip[BrainGameData.currentLevel - 1].tip;
        this.showTip(tip);
        EventManager.emit(EventDef.BRAINGAME_EVT_UPDATE_TOOL_COUNT);    // 更新工具数量广播
    }

    onBtnGetToolClick() {
        //获取工具
        if(sys.platform == sys.Platform.WECHAT_GAME){
            this.showTip(`是否分享获取${BrainGameData.shareGetCount}个工具?`, () => {
                SdkManager.instance.activeShare();
                BrainGameData.tipCardCount += BrainGameData.shareGetCount;
                EventManager.emit(EventDef.BRAINGAME_EVT_UPDATE_TOOL_COUNT);    // 更新工具数量广播
            });
        }else{
            this.showTip(`是否观看视频获取${BrainGameData.shareGetCount}个工具?`, () => {
                SdkManager.instance.showVideoAd(() => {
                    BrainGameData.tipCardCount += BrainGameData.shareGetCount;
                    EventManager.emit(EventDef.BRAINGAME_EVT_UPDATE_TOOL_COUNT);    // 更新工具数量广播
                });
            });
        }
    }

    onBtnSetClick() {
        //设置
        this.uiMenu.node.active = false;
        this.gameMenuBtn.active = false;
        this.uigame.active = false;
        this.gameBtnList.active = false;
        this.uiTitle.string = `设置`;

        this.settingNode.node.active = true;
        this.settingNode.show(this.initUI.bind(this));
    }

    private updateToolCount() {
        this.toolCount.string = `${BrainGameData.tipCardCount}`;
    }

    private enterGame() {
        BrainGameData.uiType = BrainGameUIType.Game;
        this.levelUI.hide();
        this.initUI();
        this.initGame();
    }

    private async initGame(): Promise<void> {
        this.uigame.removeAllChildren();
        let bundle = await BundleMgr.ins().loadBundle("brain-res")
        let resUrl = BrainGameLevelUrl[BrainGameData.currentLevel];
        let prefab = await BundleMgr.ins().loadPrefab(bundle, resUrl)
        let node = instantiate(prefab)
        node.parent = this.uigame;
    }

    private answerRight() {
        console.log("回答正确");
        let levelTip = BrainGameData.levelGameTip[BrainGameData.currentLevel - 1];
        let btnText = BrainGameData.currentLevel == BrainGameData.maxLevel ? "完成" : "下一关";
        this.uiMenu.initUI(btnText, levelTip.endShow);
        this.uiMenu.node.active = true;
        this.gameMenuBtn.active = false;
        this.uigame.active = false;
        this.gameBtnList.active = false;
        if (BrainGameData.currentLevel == BrainGameData.maxLevel) {
            this.uiMenu.clickCB = this.onBtnHomeClick.bind(this);
            return;
        }
        BrainGameData.currentLevel++;   // 下一关
        if (BrainGameData.currentLevel > BrainGameData.lockMaxLevel) {
            BrainGameData.lockMaxLevel = BrainGameData.currentLevel;
        }
        this.uiMenu.clickCB = () => {
            this.initUI();
            this.initGame();
        };
    }

    private showTip(tip: string, confirmCB: () => void = null) {
        this.tipNode.active = true;
        Tween.stopAllByTarget(this.tipNode);
        this.tipNode.setPosition(800, 0);
        tween(this.tipNode)
            .to(0.2, { position: Vec3.ZERO })
            .start();
        this.tipNode.getComponentInChildren(Label).string = tip;
        this.tipConfirmCB = confirmCB;
    }

    private onBtnHideTipClick() {
        this.tipNode.active = false;
    }

    private tipConfirmCB: () => void = null;
    onBtnConfirmTipClick() {
        this.tipNode.active = false;
        if (this.tipConfirmCB) {
            this.tipConfirmCB();
        }
        this.tipConfirmCB = null;
    }

    onDestroy() {
        super.onDestroy();
        EventManager.off(EventDef.BRAINGAME_EVT_ANSWER_RIGHT, this.answerRight.bind(this));    // 回答正确广播
        EventManager.off(EventDef.BRAINGAME_EVT_ENTER, this.enterGame.bind(this));    // 进入游戏广播
        EventManager.off(EventDef.BRAINGAME_EVT_UPDATE_TOOL_COUNT, this.updateToolCount.bind(this));    // 更新工具数量广播
        BrainGameData.menuLight = null;
        BrainGameData.menuTitle = null;
    }
}

