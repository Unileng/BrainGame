import { _decorator, Component, EventTouch, Node, tween, Tween, v3 } from 'cc';
import { BrainGameBase } from '../BrainGameBase';
const { ccclass, property } = _decorator;

@ccclass('BrainGame/BrainGameLevel40')
export class BrainGameLevel40 extends BrainGameBase {
    @property(Node)
    private car: Node = null;

    @property(Node)
    private carDoor: Node = null;

    init(): void {
        super.init();
        this.carDoor.setPosition(v3(-20, 0, 0));
        this.carDoor.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.carDoor.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.carDoor.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.carDoor.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(): void {
        
    }

    onTouchMove(event: EventTouch): void {
        let delta = event.getDelta();
        this.carDoor.setPosition(v3(this.carDoor.x + delta.x, this.carDoor.y + delta.y, 0));
    }

    onTouchEnd(): void {
        if(this.carDoor.x < 0){
            this.carDoor.setPosition(v3(-20, 0, 0));
        }else{
            this.carDoor.setPosition(v3(20, 0, 0));
        }
    }

    onBtnStartMove(): void {
         this.moveCar(this.carDoor.x < 0);
    }

    moveCar(isRight: boolean): void {
        Tween.stopAllByTarget(this.car);
        let endPos = isRight ? v3(1000, this.car.y, 0) : v3(-1000, this.car.y, 0);
        tween(this.car)
            .to(2, { position: endPos })
            .call(() => {
                if (!isRight) {
                    this.answerRight();
                    this.showRight();
                } else {
                    this.car.setPosition(v3(0, this.car.y, 0));
                    this.showError();
                }
            })
            .start();
    }
}

