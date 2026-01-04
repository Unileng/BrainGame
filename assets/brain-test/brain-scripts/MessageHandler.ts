import { Component } from "cc";
import { EventManager } from "./EventManager";

// 存储装饰器元数据（以类构造函数为键）
const classHandlers = new Map<Function, { eventName: string; methodName: string }[]>();

export function MessageHandler(eventName: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        // target 是类的原型，target.constructor 是类本身
        const constructor = target.constructor;
        
        if (!classHandlers.has(constructor)) {
            classHandlers.set(constructor, []);
        }
        
        classHandlers.get(constructor)!.push({
            eventName,
            methodName: propertyKey
        });
    };
}

export class MsgHandlerComponent extends Component {
    onLoad() {
        super.onLoad?.(); // 调用父类的 onLoad（如果有）
        this.registerMessageHandlers();
    }

    onDestroy() {
        super.onDestroy?.(); // 调用父类的 onDestroy（如果有）
        EventManager.offTarget(this);
    }

    private registerMessageHandlers() {
        const constructor = this.constructor;
        if (!classHandlers.has(constructor)) {
            return; // 没有装饰器方法
        }
        const handlers = classHandlers.get(constructor)!;
        for (const handler of handlers) {
            const method = (this as any)[handler.methodName];
            if (typeof method !== "function") {
                console.error(
                    `[装饰器] ${constructor.name} 中未找到方法 ${handler.methodName}`
                );
                continue;
            }
            // 注册事件监听
            EventManager.on(handler.eventName, method, this);
            // console.log(
            //     `[装饰器] 注册事件: ${handler.eventName} -> ${constructor.name}.${handler.methodName}`
            // );
        }
    }
}

// 方式二：手动调用注册方法
export function RegisterMsgHander(target: any) {
    const constructor = target.constructor;
    if (!classHandlers.has(constructor)) {
        return; // 没有装饰器方法
    }
    const handlers = classHandlers.get(constructor)!;
    for (const handler of handlers) {
        const method = (target as any)[handler.methodName];
        if (typeof method !== "function") {
            console.error(`[装饰器] ${constructor.name} 中未找到方法 ${handler.methodName}`);
            continue;
        }
            
        // 注册事件监听
        EventManager.on(handler.eventName, method, target);
        // console.log(
        //     `[装饰器] 注册事件: ${handler.eventName} -> ${constructor.name}.${handler.methodName}`
        // );
    }    
}


// 使用方式如下
// class HybridComponent extends MessageHandlerComponent {
        // 方式一装饰器，无需再 调用 EventManager.off 方法
//     @MessageHandler("AnswerResp")
//     onAnswerRespByDecorator(resp: pb.AnswerResp) {
//         console.log("装饰器方式处理AnswerResp");
//     }


//     onLoad() {
//         super.onLoad(); // 调用父类注册装饰器方法
//     }
    
//     onDestroy() {
//         super.onDestroy(); // 调用父类清理方法
//     }
// }

// 方式2
// EventManager.on("AnswerResp", this.onAnswerRespByTraditional, this);
// onAnswerRespByTraditional(resp: pb.AnswerResp) {}