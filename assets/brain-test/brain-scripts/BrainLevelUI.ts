import { _decorator, Component, Label, Node } from 'cc';
import { BrainGameData } from './BrainGameData';
import { BrainLevelItem } from './BrainLevelItem';
import SdkManager from '../../scripts/SdkManager';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainLevelUI')
export class BrainLevelUI extends Component {
    @property(Node)
    private levels: Node[] = [];

    @property(Node)
    private btnNext: Node = null;

    @property(Node)
    private btnLast: Node = null;

    private hideCallback: Function = null;

    private currentPage = 0;

    show(hideCallback: Function = null) {
        SdkManager.instance.showInterstitialAd();
        this.node.active = true;
        this.hideCallback = hideCallback;
        this.currentPage = Math.floor((BrainGameData.currentLevel - 1) / this.levels.length);
        console.log("currentPage", this.currentPage);
        this.initUI();
    }

    hide() {
        this.node.active = false;
        this.hideCallback && this.hideCallback();
    }

    initUI() {
        let lockLevel = BrainGameData.lockMaxLevel;
        let maxLevel = BrainGameData.maxLevel;
        this.updatePage();
        for (let i = 0; i < this.levels.length; i++) {
            let levelNode = this.levels[i];
             let level = i + this.currentPage * this.levels.length + 1;
            if(level > maxLevel) {
                levelNode.active = false;
                continue;
            }
            levelNode.active = true;
            let isLock = level > lockLevel;
            let levelItem = levelNode.getComponent(BrainLevelItem);
            levelItem.initItem(level, isLock);
        }
    }

    private updatePage() {
        let maxPage = Math.floor((BrainGameData.maxLevel - 1) / this.levels.length);
        this.btnNext.active = this.currentPage < maxPage;
        this.btnLast.active = this.currentPage > 0;
    }

    private onBtnNextClick() {
        let maxPage = Math.floor((BrainGameData.maxLevel - 1) / this.levels.length);
        if(this.currentPage >= maxPage) {
            return;
        }
        this.currentPage++;
        this.updatePage();
        this.initUI();
    }

    private onBtnLastClick() {
        if(this.currentPage <= 0) {
            return;
        }
        this.currentPage--;
        this.updatePage();
        this.initUI();
    }

    private onBtnBackClick() {
        this.hide();
    }
}

