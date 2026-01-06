

declare namespace tt {
    type IDBGameRecorder = {
        start(object: Object);
        stop();
        pause();
        resume();

        onStart(callback: (res) => void);
        onStop(callback: (res: { videoPath: string, duration: number }) => void);
        onPause(callback: Function);
        onResume(callback: Function);
        onError(callback: (errMs: string) => void);
    }
    function getGameRecorderManager(): IDBGameRecorder;

    function openCustomerServiceConversation(object: any);

    function checkScene(options: {
        scene: 'sidebar',
        success?: (res: { isExist: boolean, errMsg: string }) => void,
        complete?: () => void,
        fail?: (res: { errNo: number, errMsg: string }) => void
    }): void;

    function navigateToScene(options: any);         //scene=021036, 首页侧边栏-最近使用（常用小程序）​  scene=021012，首页侧边栏-生活动态玩游​ scene=101036，抖极首页侧边栏


    type lanuchOnShow = {
        /** 启动场景字段。tt_2.92.0.0 支持*/
        launch_from?: "homepage" | "scan";
        /** 启动场景字段。tt_2.92.0.0 支持*/
        location?: "sidebar_card" | "qr_code";
    }


    /** 
    * 主动调用转发相关方法（拉起发布器、好友邀请、录屏分享等）
    */
    export function shareAppMessage(object: object): void;

    /**
     * 获取系统信息。如果在页面渲染时，需要通过调用 API 获取到的信息来设置节点宽高
     */
    export function getSystemInfoSync(): any;

    /**
     * 
     * @param object adIntervals: 广告自动刷新的间隔时间，单位为秒，参数值必须大于等于 30（该参数不传入时 Banner 广告不会自动刷新）
     *               style: 	广告位区域，包括left、top、width字段
     *               adUnitId: 广告位id 必须传
     */
    export function createBannerAd(object: object): void;

    export function createInterstitialAd(object: object): void;

    /**
    * 激励广告
    */
    export function createRewardedVideoAd(object: object): void;

    export function getSetting(any): any;

    export function getUserInfo(any): any;

    export function login(any): any;

    export function getLaunchOptionsSync(): any;
}