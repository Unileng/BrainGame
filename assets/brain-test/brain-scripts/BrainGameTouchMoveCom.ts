import { _decorator, Component, Node, Vec3, EventTouch, UITransform, tween, Collider2D, Contact2DType, IPhysics2DContact, RigidBody2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainGameTouchMoveCom')
export class BrainGameTouchMoveCom extends Component {
    @property(Boolean)
    private isMoveStartPos: boolean = false; // 是否移动回位置

    @property(Boolean)
    public isActice: boolean = true; // 是否激活

    private initPos: Vec3 = new Vec3(); // 初始位置
    private offset: Vec3 = new Vec3(); // 触摸点相对于节点中心的偏移
    private isTouching: boolean = false; // 是否正在触摸

    //碰撞检测回调
    public onColliderCB: Function = null;

    //结束回调
    public onEndContactCB: Function = null;

    private rigidBody: RigidBody2D = null;

    onLoad() {
        // 保存初始位置
        this.initPos = this.node.getPosition();

        // 添加触摸事件监听
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        let collider = this.node.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
        this.rigidBody = this.node.getComponent(RigidBody2D);
    }

    /**
     * 触摸开始时记录偏移
     */
    private onTouchStart(event: EventTouch) {
        if(!this.isActice){
            return;
        }
        this.isTouching = true;

        // 获取触摸位置（世界坐标）
        const touchPos = event.getUILocation();

        // 获取节点的世界坐标
        const worldPos = this.node.getWorldPosition();

        // 计算偏移量：触摸点 - 节点中心（世界坐标）
        this.offset.x = touchPos.x - worldPos.x;
        this.offset.y = touchPos.y - worldPos.y;
        this.offset.z = 0;
    }

    /**
     * 触摸移动时跟随鼠标
     */
    private onTouchMove(event: EventTouch) {
         if(!this.isActice){
            return;
        }
        if (!this.isTouching) return;
        if(this.rigidBody && this.rigidBody.allowSleep){
            this.rigidBody.allowSleep = false;
        }
        // 获取触摸位置（世界坐标）
        const touchPos = event.getUILocation();

        // 计算新的节点位置：触摸位置 - 偏移量
        const newPos = new Vec3();
        newPos.x = touchPos.x - this.offset.x;
        newPos.y = touchPos.y - this.offset.y;
        newPos.z = this.initPos.z;

        // 设置节点位置
        this.node.setWorldPosition(newPos);
    }

    /**
     * 触摸结束时使用tween动画平滑回到初始位置
     */
    private onTouchEnd(event: EventTouch) {
        this.isTouching = false;
        if(this.rigidBody){
            this.rigidBody.allowSleep = true;
        }
        // 使用tween动画平滑回到初始位置，时长0.3秒
        // 从当前位置移动到初始位置
        // 使用easeOutQuad缓动，使动画更自然
        if (this.isMoveStartPos) {
            tween(this.node)
                .to(0.3, { position: this.initPos })
                .start();
        }
    }

    protected onDestroy(): void {
        // 移除所有事件监听
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    /**
     * 碰撞检测回调
     */
    public onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        console.log("碰撞检测", otherCollider.node.name, selfCollider.node.name);
        if (this.onColliderCB) {
            this.onColliderCB(selfCollider.node, otherCollider.node);
        }
    }

    /**
     * 碰撞检测回调
     */
    public onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        console.log("碰撞检测结束", otherCollider.node.name, selfCollider.node.name);
        if (this.onEndContactCB) {
            this.onEndContactCB(selfCollider.node, otherCollider.node);
        }
    }

}

