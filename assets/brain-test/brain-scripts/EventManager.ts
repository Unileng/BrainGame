/**
 * 事件分发管理
 * 
 */
import { _decorator, log } from 'cc';

// 3.x 与 2.x 不同，下面注释掉代码在2.x版本通用，
// let  EventManager = new EventTarget();
// let emit = EventManager.emit;
// EventManager.emit = function(eventName, ...args){
//     log("emit event ", eventName, args);
//     emit.call(this, eventName, ...args);
// }

// 事件项
class EventItem{
    eventName:string;
    callback:Function;
    target:any;
}

// 自定义实现事件分发与管理
class EventMgr {
    private events: Map<string, any[]>;

    constructor() {
        this.events = new Map();
    }

    on(event:string, callback, target = null) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        let item = new EventItem();
        item.eventName = event;
        item.callback = callback;
        item.target = target;
        this.events.get(event).push(item);
    }

    emit(event:string, ...args) {
        if (!this.events.has(event)) {
            return;
        }

        //  log("emit event ", event, args);

        const handlers = this.events.get(event);
        for (let i = handlers.length - 1; i >= 0; i--) {
            let item = handlers[i];

            // 自动清理无效target
            if (item.target && item.target.isValid === false) {
                handlers.splice(i, 1);
                continue;
            }

            item.callback.call(item.target, ...args);
        }
    }

    off(event:string, callback, target = null) {
        if (!this.events.has(event)) { 
            return; 
        }

        const handlers = this.events.get(event);
        for (let i = handlers.length - 1; i >= 0; i--) {
            const handler = handlers[i];
            if (handler.callback === callback &&
                handler.target === target) {
                handlers.splice(i, 1);
                break;
            }
        }

        if (handlers.length === 0) {
            this.events.delete(event);
        }
    }

    offTarget(target) {
        if (!target) {
            return;
        }

        // log(`[事件清理] 移除target所有事件监听`);

        for (const [event, handlers] of this.events) {
            for (let i = handlers.length - 1; i >= 0; i--) {
                if (handlers[i].target === target) {
                    handlers.splice(i, 1);
                }
            }

            if (handlers.length === 0) {
                this.events.delete(event);
            }
        }
    }
}

const EventManager = new EventMgr();

export { EventManager };