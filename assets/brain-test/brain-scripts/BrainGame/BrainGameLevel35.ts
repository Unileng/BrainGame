import { _decorator, Collider2D, Component, Contact2DType, Node, RigidBody2D, Vec2, Vec3 } from 'cc';
import { BrainGameBase } from '../BrainGameBase';
import { BrainGameTouchAngle } from './BrainGameTouchAngle';
import { BrainGameTouchMoveCom } from '../BrainGameTouchMoveCom';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainGameLevel35')
export class BrainGameLevel35 extends BrainGameBase {
    @property(BrainGameTouchAngle)
    private touchAngle: BrainGameTouchAngle = null;

    @property(RigidBody2D)
    private playerRigidBody2D: RigidBody2D = null;

    @property(Node)
    private targetNode: Node = null;

    private angle: Vec2 = new Vec2(0, 0);

    private speed: number = 3;

    init() {
        super.init();
        this.touchAngle.topClickCB = this.onBtnTopClick.bind(this);
        this.touchAngle.bottomClickCB = this.onBtnBottomClick.bind(this);
        this.touchAngle.leftClickCB = this.onBtnLeftClick.bind(this);
        this.touchAngle.rightClickCB = this.onBtnRightClick.bind(this);
        this.touchAngle.cancelCB = this.onBtnCancel.bind(this);
        this.schedule(this.checkAnswer, 0.1);
    }

    private checkAnswer() {
        let dis = Vec3.distance(this.playerRigidBody2D.node.position, this.targetNode.position);
        if (dis < 50) {
            this.unschedule(this.checkAnswer);
            this.showRight(this.targetNode.position);
            this.answerRight();
        }
    }

    
    onBtnCancel() {
        this.angle.set(0, 0);
        this.playerRigidBody2D.linearVelocity = new Vec2(0, 0);
    }

    onBtnTopClick() {
        this.angle.set(0, 1);
        this.playerRigidBody2D.linearVelocity = this.angle.multiplyScalar(this.speed);
        this.scheduleOnce(()=>{
            this.onBtnCancel();
        }, 0.1);
    }

    onBtnBottomClick() {
        this.angle.set(0, -1);
        this.playerRigidBody2D.linearVelocity = this.angle.multiplyScalar(this.speed);
        this.scheduleOnce(()=>{
            this.onBtnCancel();
        }, 0.1);
    }

    onBtnLeftClick() {
        this.angle.set(-1, 0);
        this.playerRigidBody2D.linearVelocity = this.angle.multiplyScalar(this.speed);
        this.scheduleOnce(()=>{
            this.onBtnCancel();
        }, 0.1);
    }

    onBtnRightClick() {
        this.angle.set(1, 0);
        this.playerRigidBody2D.linearVelocity = this.angle.multiplyScalar(this.speed);
        this.scheduleOnce(()=>{
            this.onBtnCancel();
        }, 0.1);
    }

}

