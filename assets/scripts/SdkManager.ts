import { size, sys } from "cc";

export default class SdkManager {
    private static _instance: any = null;

    public static get instance() {
        if (null == this._instance) {
            this._instance = new SdkManager();
        }
        return this._instance
    }

    shareMsg: string = "这道题好难，快来帮我看一下？"
    // 激励视频
    videoId: string = 'o2tonaq1ti37smeb8d'
    private videoAd = null
    // 插屏
    interstitialId: string = 'd1c0dfhk5h3595p4r1'
    private interstitialAd = null
    // 横幅
    bannerId: string = 'cmlk6pm8h4e18g3blq'
    private bannerAd = null
    private showBanner = false;

    // 主动分享
    activeShare() {
        if (sys.platform == sys.Platform.WECHAT_GAME) {
            wx.shareAppMessage({
                title: this.shareMsg
            });
            return
        }
        if (sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
            tt.shareAppMessage({
                title: this.shareMsg
            });
            return
        }
        console.log('【主动分享】仅支持微信/抖音平台!')
    }

    // 被动分享
    passiveShare() {
        if (sys.platform != sys.Platform.WECHAT_GAME) {
            console.log('【被动分享】仅支持微信平台!')
            return
        }
        wx.showShareMenu({
            success: (res: any) => { },
            fail: (res: any) => { }
        });
        wx.onShareAppMessage(() => {
            return {
                title: this.shareMsg
            }
        });
    }

    // 跳转
    turnToApp(appId: string) {
        if (sys.platform != sys.Platform.WECHAT_GAME) {
            console.log('【程序跳转】仅支持微信平台!', appId)
            return
        }
        wx.navigateToMiniProgram({
            appId: appId
        });
    }

    // 初始化横幅
    initBannerAd() {
        if (sys.platform == sys.Platform.WECHAT_GAME) {
            if (this.bannerId == '') {
                console.log('【流量主】请配置横幅广告ID')
                return
            }
            let winSize = wx.getSystemInfoSync();
            if (this.bannerAd == null) {
                this.bannerAd = wx.createBannerAd({
                    adUnitId: this.bannerId,
                    adIntervals: 10,
                    style: {
                        height: winSize.windowHeight - 80,
                        left: 0,
                        top: 500,
                        width: winSize.windowWidth
                    }
                });
                this.bannerAd.onResize((res: any) => {
                    this.bannerAd.style.top = winSize.windowHeight - this.bannerAd.style.realHeight;
                    this.bannerAd.style.left = winSize.windowWidth / 2 - this.bannerAd.style.realWidth / 2;
                });
                this.bannerAd.onError((err: any) => {
                    console.error('【wx流量主横幅】初始化有误')
                });
            }
            return
        }
        if (sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
            if (this.bannerId == '') {
                console.log('【流量主】请配置横幅广告ID')
                return
            }
            if (this.bannerAd == null) {
                this.bannerAd = tt.createBannerAd({
                    adUnitId: this.bannerId,
                    adIntervals: 30,
                    style: {
                        width: this.winSize.windowWidth,
                    }
                });
                
                this.bannerAd.onError((err: any) => {
                    console.error('【tt流量主横幅】初始化有误',err)
                });

                this.bannerAd.onError((err: any) => {
                    console.error('【tt流量主横幅】初始化有误',err)
                });

                this.bannerAd.onLoad((err: any) => {
                    if(this.showBanner){
                        this.bannerAd.show().then(()=>{
                            console.log('【tt流量主横幅】加载成功!')
                        });
                    }
                });
            }
            return
        }

        console.log('【流量主横幅初始化】仅支持微信/抖音平台!')
    }

    // 横幅展示
    toggleBannerAd(isShow: boolean) {
        if (sys.platform == sys.Platform.WECHAT_GAME) {
            if (this.bannerAd) {
                isShow ? this.bannerAd.show() : this.bannerAd.hide();
            }
            return
        }
        if (sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
            if(this.bannerId){
                this.showBanner = isShow;
                if (isShow) {
                    this.bannerAd.show().then(()=>{
                        console.log('【tt流量主横幅】加载成功!')
                    });
                } else {
                    this.bannerAd?.hide();
                }
            }else{
                this.initBannerAd();
            }
            return
        }
        console.log('【流量主横幅】仅支持微信/抖音平台!')
    }

    // 初始化插屏
    initInterstitialAd() {
        if (sys.platform == sys.Platform.WECHAT_GAME) {
            if (this.interstitialId == '') {
                console.log('【流量主】请配置插屏广告ID')
                return
            }
            if (this.interstitialAd == null) {
                this.interstitialAd = wx.createInterstitialAd({
                    adUnitId: this.interstitialId
                });
                this.interstitialAd.onError((err: any) => {
                    console.error('【流量主插屏】初始化有误')
                });
            }
            return
        }
        if (sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
            if (this.interstitialId == '') {
                console.log('【流量主】请配置插屏广告ID')
                return
            }
            if (this.interstitialAd == null) {
                this.interstitialAd = tt.createInterstitialAd({
                    adUnitId: this.interstitialId
                });
                this.interstitialAd?.onError((err: any) => {
                    console.error('【流量主插屏】初始化有误',err)
                });
            }
            return
        }
        console.log('【流量主插屏初始化】仅支持微信/抖音平台!')
    }

    // 插屏展示
    showInterstitialAd() {
        if (sys.platform != sys.Platform.WECHAT_GAME && sys.platform != sys.Platform.BYTEDANCE_MINI_GAME) {
            console.log('【流量主插屏】仅支持微信平台!')
            return
        }
        if (this.interstitialAd) {
            this.interstitialAd.show().catch((err: any) => {
                console.error('【流量主插屏】加载失败',err)
            });
        }
    }

    // 初始化激励
    initVideoAd() {
        if (sys.platform == sys.Platform.WECHAT_GAME) {
            if (this.videoId == '') {
                console.log('【流量主】请配置激励视频广告ID')
                return
            }
            if (this.videoAd == null) {
                this.videoAd = wx.createRewardedVideoAd({
                    adUnitId: this.videoId
                });
                this.videoAd.onError((err: any) => {
                    console.error('【流量主激励】初始化有误')
                });
            }
            return
        }
        if (sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
            if (this.videoId == '') {
                console.log('【流量主】请配置激励视频广告ID')
                return
            }
            if (this.videoAd == null) {
                this.videoAd = tt.createRewardedVideoAd({
                    adUnitId: this.videoId
                });
                this.videoAd.onError((err: any) => {
                    console.error('【流量主激励】初始化有误')
                });
            }
            return
        }
        console.log('【流量主激励初始化】仅支持微信/抖音平台!')
    }

    // 激励展示
    showVideoAd(success: any, fail?: any) {
        if (sys.platform != sys.Platform.WECHAT_GAME && sys.platform != sys.Platform.BYTEDANCE_MINI_GAME) {
            console.log('激励模拟成功1')
            return success && success()
        }
        if (this.videoAd) {
            this.videoAd.offClose();
            this.videoAd.onClose((res: any) => {
                this.videoAd.offClose();
                if (res && res.isEnded || res === undefined) {
                    return success && success()
                } else {
                    return fail && fail()
                }
            });
            this.videoAd.show().catch(() => {
                this.videoAd.load()
                    .then(() => this.videoAd.show())
                    .catch((err: any) => {
                        console.log('广告展示失败')
                    })
            });
        } else {
            console.log('激励模拟成功2')
            return success && success()
        }
    }

    /**
     * 获取排行榜
     */
    getRank() {
        if (sys.platform != sys.Platform.WECHAT_GAME) {
            console.log('【获取排名】仅支持微信平台!')
            return
        }
        wx.postMessage({
            event: 'getRank'
        })
    }

    /**
     * 设置排名
     * @param data 关卡数
     */
    setRank(data: number) {
        if (sys.platform != sys.Platform.WECHAT_GAME) {
            console.log('【设置排名】仅支持微信平台!', data)
            return
        }
        wx.postMessage({
            event: 'setScore',
            score: data
        })
    }


    private winSize: any = null;
    getSafeArea(): any {
        if (this.winSize) {
            return this.winSize;
        }
        if (sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
            let winSize = tt.getSystemInfoSync().safeArea;
            console.log('【安全区域】抖音', winSize)
            this.winSize = winSize;
            return { height: winSize.top };
        }
        if (sys.platform == sys.Platform.WECHAT_GAME) {
            let winSize = wx.getSystemInfoSync()
            this.winSize = winSize;
            return winSize;
        }
        console.log('【安全区域】仅支持抖音/微信平台!')
        return null
    }
}
