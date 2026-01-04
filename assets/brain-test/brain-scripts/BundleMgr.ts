/**
 * bundle 管理
 */

import { AssetManager, assetManager, director, Prefab, Sprite, SpriteFrame } from "cc";
import { BaseIns } from "./BaseIns";

export class BundleMgr extends BaseIns {

    private loadedBundles: Map<string, AssetManager.Bundle> = new Map();


    public static ins(): BundleMgr {
        return super.ins() as BundleMgr;
    }



    async loadBundle(bundleName: string): Promise<AssetManager.Bundle> {
        // 如果bundle已经加载，直接返回
        if (this.loadedBundles.has(bundleName)) {
            return this.loadedBundles.get(bundleName);
        }

        return new Promise((resolve, reject) => {
            assetManager.loadBundle(bundleName, (error, bundle) => {
                if (error) {
                    console.error(`加载bundle失败: ${bundleName}`, error);
                    reject(error);
                } else {
                    console.log(`bundle加载成功: ${bundleName}`);
                    this.loadedBundles.set(bundleName, bundle);
                    resolve(bundle);
                }
            });
        });
    }

    /**
     * 加载场景
     */
    async loadScene(bundle: AssetManager.Bundle, scenePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            bundle.loadScene(scenePath, (error, scene) => {
                if (error) {
                    console.error(`加载场景失败: ${scenePath}`, error);
                    reject(error);
                } else {
                    director.runSceneImmediate(scene);
                    console.log(`场景运行成功: ${scenePath}`);
                    resolve();
                }
            });
        });
    }

    /**
     * 加载预制体
     */
    async loadPrefab(bundle: AssetManager.Bundle, prefrabStr: string): Promise<Prefab> {
        return new Promise((resolve, reject) => {
            bundle.load(prefrabStr, Prefab, (error, prefab) => {
                if (error) {
                    console.error(`加载预制体失败: ${prefrabStr}`, error);
                    reject(error);
                } else {
                    resolve(prefab);
                }
            });
        });
    }

    /**
     * 加载图片
     * @param bundle 
     * @param prefrabStr 
     * @returns 
     */
    async loadSprite(bundle: AssetManager.Bundle, sprPath: string): Promise<SpriteFrame> {
        return new Promise((resolve, reject) => {
            bundle.load(sprPath, SpriteFrame, (error, spriteFrame) => {
                if (error) {
                    console.error(`加载图片失败: ${sprPath}`, error);
                    reject(error);
                } else {
                    resolve(spriteFrame);
                }
            });
        });
    }

    /**
     * 设置图片
     * @param sprite 
     * @param bundleName 
     * @param sprPath 
     */
    async setSprite(sprite: Sprite, bundleName: string, sprPath: string) {
        if(!sprite){
            return
        }
        let bundle = await BundleMgr.ins().loadBundle(bundleName)
        if(!bundle){
            return
        }
        let spriteFrame = await BundleMgr.ins().loadSprite(bundle, sprPath)
        if(!spriteFrame){
            return
        }
        sprite.spriteFrame = spriteFrame
    }
}