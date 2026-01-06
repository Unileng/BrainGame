import { _decorator, Component, director, Node } from 'cc';
import { BundleMgr } from '../brain-test/brain-scripts/BundleMgr';
const { ccclass, property } = _decorator;

@ccclass('Load')
export class Load extends Component {
    protected onLoad(): void {
        this.loadRes();
    }

    async loadRes() {
        let bundleBrain = await BundleMgr.ins().loadBundle('brain-res');
        await BundleMgr.ins().loadBundle('sub-res');
        await BundleMgr.ins().loadScene(bundleBrain, 'scenes/brain');
    }
}

