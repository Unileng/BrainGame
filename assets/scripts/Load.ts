import { _decorator, Component, director, Node, ProgressBar } from 'cc';
import { BundleMgr } from '../brain-test/brain-scripts/BundleMgr';
const { ccclass, property } = _decorator;

@ccclass('Load')
export class Load extends Component {
    @property(ProgressBar)
    progressBar: ProgressBar = null;

    protected onLoad(): void {
        this.loadRes();
    }

    async loadRes() {
        let bundleBrain = await BundleMgr.ins().loadBundle('brain-res');
        this.progressBar.progress = 0.5;
        await BundleMgr.ins().loadBundle('sub-res');
        this.progressBar.progress = 0.9;
        await BundleMgr.ins().loadScene(bundleBrain, 'scenes/brain');
    }
}

