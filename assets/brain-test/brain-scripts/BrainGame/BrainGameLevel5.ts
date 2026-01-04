import { _decorator, EPhysics2DDrawFlags, Input, input, Node, PhysicsSystem, PhysicsSystem2D, RaycastResult2D, tween, Tween, v3, Vec2 } from 'cc';
import { BrainGameBase } from '../BrainGameBase';
import { BrainGameTouchMoveCom } from '../BrainGameTouchMoveCom';
const { ccclass, property } = _decorator;
//花朵找太阳
@ccclass('BrainGame/BrainGameLevel5')
export class BrainGameLevel5 extends BrainGameBase {
    @property({ type: Node, displayName: '花朵', })
    private flowerNode: Node = null;

    @property({ type: Node, displayName: '太阳', })
    private sunNode: Node = null;

    @property({ type: Node, displayName: '花朵开放', })
    private flowerOpenNode: Node = null;

    @property({ type: Node, displayName: '花朵开放动画', })
    private flowerOpenAniNode: Node = null;

    // @property({ type: BrainGameTouchMoveCom, displayName: '云朵', })
    // private flowerModelNode: BrainGameTouchMoveCom = null;

    public init(): void {
        super.init();
        PhysicsSystem2D.instance.enable = true;
        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.All;
        this.schedule(this.checkHitFlower2D, 1);
        this.flowerOpenNode.active = false;
        this.flowerNode.active = true;
        this.tipAni();
        input.on(Input.EventType.TOUCH_MOVE, this.hideTipAni, this);
    }

    private hideTipAni(): void {
        if (!this.tipShow) return;
        Tween.stopAllByTarget(this.tipShow);
        this.tipShow.active = false;
    }

    private checkHitFlower2D(): void {
        if (!this.sunNode || !this.flowerNode) {
            console.warn('太阳或花朵节点未设置');
            return;
        }

        const sunPos3 = this.sunNode.getWorldPosition();
        const flowerPos3 = this.flowerNode.getWorldPosition();

        const sunPos = new Vec2(sunPos3.x, sunPos3.y);
        const flowerPos = new Vec2(flowerPos3.x, flowerPos3.y);

        const results: ReadonlyArray<RaycastResult2D> =
            PhysicsSystem2D.instance.raycast(
                sunPos,
                flowerPos,
            );
        if (results.length === 0) return;

        // 最近的命中在 results[0]
        const hitNode = results[0].collider.node;
        if (
            hitNode === this.flowerNode ||
            hitNode.isChildOf(this.flowerNode)
        ) {
            // console.log('2D 射线命中花朵');
            this.showRightAni();
            this.answerRight();
        }
    }

    private showRightAni(): void {
        this.flowerOpenNode.active = true;
        this.flowerNode.active = false;
        Tween.stopAllByTarget(this.flowerOpenAniNode);
        tween(this.flowerOpenAniNode)
            .repeatForever(
                tween()
                    .to(0.5, { angle: 360 })
                    .set({ angle: 0 })
                    .start()
            )
            .start();
    }

    private tipAni(): void {
        if (!this.tipShow) return;
        let pos = this.tipShow.position;
        tween(this.tipShow)
            .to(1, { position: v3(pos.x + 100, pos.y) })
            .to(0.5, { position: v3(pos.x, pos.y) })
            .to(1, { position: v3(pos.x + 100, pos.y) })
            .to(0.5, { position: v3(pos.x, pos.y) })
            .call(() => {
                this.tipShow.active = false;
            })
            .start()
    }

}

