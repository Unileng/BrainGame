import { Node } from "cc";
import { BrainGameTouchMoveCom } from "./BrainGameTouchMoveCom";

export enum BrainGameUIType {
    Menu = 0,
    Game = 1,
}

export const BrainGameLevelUrl = {
    1: 'prefab/level1',
    2: 'prefab/level5',
    3: 'prefab/level2',
    4: 'prefab/level4',
    5: 'prefab/level3',
    6: 'prefab/level6',
    7: 'prefab/level7',
    8: 'prefab/level8',
    9: 'prefab/level9',
    10: 'prefab/level10',
    11: 'prefab/level11',
    12: 'prefab/level12',
    13: 'prefab/level13',
    14: 'prefab/level14',
    15: 'prefab/level15',
    16: 'prefab/level16',
    17: 'prefab/level17',
    18: 'prefab/level18',
    19: 'prefab/level19',
    20: 'prefab/level20',
    21: 'prefab/level21',
    22: 'prefab/level22',
    23: 'prefab/level23',
    24: 'prefab/level24',
    25: 'prefab/level25',
    26: 'prefab/level26',
    27: 'prefab/level27',
    28: 'prefab/level28',
    29: 'prefab/level29',
    30: 'prefab/level30',
    31: 'prefab/level31',
    32: 'prefab/level32',
    33: 'prefab/level33',
    34: 'prefab/level34',
    35: 'prefab/level35',
    36: 'prefab/level36',
    37: 'prefab/level37',
    38: 'prefab/level38',
    39: 'prefab/level39',
    40: 'prefab/level40',
    41: 'prefab/level41',
}

export class BrainGameData {
    public static lockMaxLevel = 1;       //解锁到的关卡等级
    public static maxLevel = 41;         //最大关卡等级
    public static currentLevel = 1;     //当前关卡等级
    public static uiType = BrainGameUIType.Menu;       //当前游戏UI类型

    private static _tipCardCount = 0;

    public static initData() {
        let localCard = localStorage.getItem('brainGameTipCard');
        if (localCard) {
            this._tipCardCount = parseInt(localCard);
        } else {
            this._tipCardCount = 0;
        }
    }

    public static get tipCardCount() {
        return this._tipCardCount;
    }

    public static set tipCardCount(count: number) {
        this._tipCardCount = count;
        localStorage.setItem('brainGameTipCard', count.toString());
    }


    public static readonly levelGameTip = [
        { "endShow": "狮子在这些图里面是最大的哦～", "tip": "看图片就好了哦" },
        { "endShow": "真漂亮的花朵～", "tip": "雲朵真碍事" },
        { "endShow": "很简单吧～", "tip": "先打开冰箱哦" },
        { "endShow": "现在我们是朋友了～", "tip": "变绿就好了" },
        { "endShow": "基础数学题～", "tip": "先乘除后加减" },
        { "endShow": "记忆力不错哦～", "tip": "也许可以先把它们写下來" },
        { "endShow": "你是移开了石头看到的答案吧～", "tip": "换个角度看问题" },
        { "endShow": "那一堆公式是用来干什么的呢～", "tip": "不要被它迷惑了" },
        { "endShow": "其他公式是错误的～", "tip": "正常计算就好了" },
        { "endShow": "数字4的上面当然是数字5哦～", "tip": "不要看那些球" },
        { "endShow": "挺简单的是吧～", "tip": "13 + 7 也等于 20" },
        { "endShow": "被骗到了吗？", "tip": "看清楚字哦～" },
        { "endShow": "有时候答案是要自己创造的～", "tip": "题目可以移动哦～" },
        { "endShow": "不要让你的思想限制在二次元哦～", "tip": "別忘了另一边" },
        { "endShow": "界面帮大忙了～", "tip": "可以用灯照亮它" },
        { "endShow": "留意隐藏的元素哦～", "tip": "披萨背后有什么？" },
        { "endShow": "他在那里干什么", "tip": "点一下后面的蛋" },
        { "endShow": "太贪心可不行～", "tip": "也需我们可以改变需求～" },
        { "endShow": "高度最重要", "tip": " -112 是最低的。" },
        { "endShow": "你没尝试点击100下吧", "tip": "或许可以修改一下题目" },
        { "endShow": "还没分开他们就开始数了吗", "tip": "尝试分开他们" },
        { "endShow": "你很敏锐👍", "tip": "想象不同角度" },
        { "endShow": "耐心是好事", "tip": "要有耐心等待" },
        { "endShow": "第三个灯泡坏掉了", "tip": "书里面的灯泡" },
        { "endShow": "点点点", "tip": "找出藏起来的按钮" },
        { "endShow": "太棒了", "tip": "注意关卡数" },
        { "endShow": "一只手拿一个苹果", "tip": "你拿走了几个呢？" },
        { "endShow": "猫的孩子还是猫", "tip": "猫字也是猫" },
        { "endShow": "你没回答 10 吧～", "tip": "他们都是一家人哦，只有一个妹妹" },
        { "endShow": "蛋糕很好吃～", "tip": "蛋糕上有几个蜡烛呢？" },
        { "endShow": "每个月最少有 28 天～", "tip": "31 > 28" },
        { "endShow": "6 和 9 又反转了", "tip": "注意～猫倒过来了" },
        { "endShow": "红 + 绿 = 黄", "tip": "红 + 绿 = 黄" },
        { "endShow": "它在这里！", "tip": "你可以把其中一只涂成黑色" },
        { "endShow": "你做弊了吗", "tip": "不需要穿过迷宫" },
        { "endShow": "没有丝毫难度吧", "tip": "数数交叉点" },
        { "endShow": "树🌲可不是动物", "tip": "树🌲可不是动物" },
        { "endShow": "善用手边的东西", "tip": "蜡烛上面的火也可以用" },
        { "endShow": "没有尝试输入骰子上的数字吧", "tip": "推开骰子就可以看到" },
        { "endShow": "这车会变形", "tip": "注意车把手" },
    ];

    public static readonly getTipCost = 10;

    public static readonly shareGetCount = 10;

    //UI
    public static menuLight: BrainGameTouchMoveCom = null;

    public static menuTitle: Node = null;
}