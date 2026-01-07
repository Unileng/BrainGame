/**
 * 音频管理器
 */

import { AssetManager, AudioClip, AudioSource, director, warn, Node, tween } from "cc";
import { BundleMgr } from "./BundleMgr";
import { BaseIns } from "./BaseIns";

// 音效实例信息
interface AudioInstance {
    audioSource: AudioSource;
    path: string;
    bundle: string;
    loop: boolean;
}

export class AudioMgr extends BaseIns {

    // 背景音乐AudioSource
    private _bgmAudioSource: AudioSource = null;
    // 当前背景音乐路径
    private _currentBGM: { path: string, bundle: string } = { path: '', bundle: '' };

    // 音效实例映射
    private _audioInstances: Map<string, AudioInstance> = new Map();
    // 音效组映射
    private _audioGroups: Map<string, Set<string>> = new Map();

    // 音频资源缓存 (key: bundle_path)
    private _audioCache: Map<string, AudioClip> = new Map();


    // 音量设置
    private _musicVolume: number = 1.0;
    private _sfxVolume: number = 1.0;

    // 静音状态
    private _musicMuted: boolean = false;
    private _sfxMuted: boolean = false;

    // 音频节点（用于挂载AudioSource组件）
    private _audioNode: Node = null;

    static ins(): AudioMgr {
        return super.ins() as AudioMgr;
    }

    // 预加载音频资源
    async preloadAudio(paths: string[], bundleName: string = 'resources'): Promise<void> {
        // 检查音频节点是否存在
        this.checkAudioNode();

        // 确保 Bundle 已加载
        const bundle = await BundleMgr.ins().loadBundle(bundleName);
        const promises = paths.map(path => this.loadAudioClip(path, bundle));
        await Promise.all(promises);
    }

    // 播放背景音乐 (兼容旧版本，默认使用 resources bundle)
    async playMusic(path: string, volume: number = 1.0, loop: boolean = true): Promise<boolean> {
        return this.playMusicFromBundle('resources', path, volume, loop);
    }

    // 从指定 Bundle 播放背景音乐
    async playMusicFromBundle(bundleName: string, path: string, volume: number = 1.0, loop: boolean = true): Promise<boolean> {
        const currentKey = `${bundleName}_${path}`;
        const currentBGMKey = `${this._currentBGM.bundle}_${this._currentBGM.path}`;

        if (currentKey === currentBGMKey && this._bgmAudioSource && this._bgmAudioSource.playing) {
            return true; // 相同的背景音乐正在播放
        }

        // 停止当前背景音乐
        this.stopMusic();

        try {
            // 确保 Bundle 已加载
            const bundle = await BundleMgr.ins().loadBundle(bundleName);
            const audioClip = await this.loadAudioClip(path, bundle);

            // 创建或获取AudioSource组件
            if (!this._bgmAudioSource) {
                this._bgmAudioSource = this.createAudioSource();
            }

            this._currentBGM = { path, bundle: bundleName };
            this._bgmAudioSource.clip = audioClip;
            this._bgmAudioSource.loop = loop;

            const effectiveVolume = this._musicMuted ? 0 : volume * this._musicVolume;
            this._bgmAudioSource.volume = effectiveVolume;

            this._bgmAudioSource.play();
            return true;
        } catch (error) {
            warn(`播放背景音乐失败: ${bundleName}/${path}`, error);
            return false;
        }
    }

    // 停止背景音乐
    stopMusic(): void {
        if (this._bgmAudioSource) {
            this._bgmAudioSource.stop();
            this._currentBGM = { path: '', bundle: '' };
        }
    }

    // 暂停背景音乐
    pauseMusic(): void {
        if (this._bgmAudioSource) {
            this._bgmAudioSource.pause();
        }
    }

    // 恢复背景音乐
    resumeMusic(): void {
        if (this._bgmAudioSource && !this._bgmAudioSource.playing) {
            this._bgmAudioSource.play();
        }
    }

    // 播放音效 (兼容旧版本，默认使用 resources bundle)
    async playAudioEff(path: string, volume: number = 1.0, loop: boolean = false): Promise<string> {
        return this.playAudioEffFromBundle('resources', path, volume, loop);
    }

    // 从指定 Bundle 播放音效
    async playAudioEffFromBundle(bundleName: string, path: string, volume: number = 1.0, loop: boolean = false): Promise<string> {
        try {
            // 确保 Bundle 已加载
            const bundle = await BundleMgr.ins().loadBundle(bundleName);
            const audioClip = await this.loadAudioClip(path, bundle);

            const audioSource = this.createAudioSource();

            audioSource.clip = audioClip;
            audioSource.loop = loop;

            const effectiveVolume = this._sfxMuted ? 0 : volume * this._sfxVolume;
            audioSource.volume = effectiveVolume;

            // 生成唯一ID
            const instanceId = `${bundleName}_${path}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // 存储音效实例信息
            const audioInstance: AudioInstance = {
                audioSource: audioSource,
                path: path,
                bundle: bundleName,
                loop: loop
            };

            this._audioInstances.set(instanceId, audioInstance);


            // 播放音效
            audioSource.play();

            // 非循环音效设置播放结束回调
            if (!loop) {
                // 使用计时器模拟播放结束
                tween(audioSource.node).delay(audioClip.getDuration()).call(() => {
                    this.stopAudioEffById(instanceId);
                }).start();
            }

            return instanceId;
        } catch (error) {
            warn(`播放音效失败: ${bundleName}/${path}`);
            return null;
        }
    }

    // 通过实例ID停止音效
    private stopAudioEffById(instanceId: string): void {
        const audioInstance = this._audioInstances.get(instanceId);
        if (audioInstance) {
            audioInstance.audioSource.stop();
            audioInstance.audioSource.node.destroy();
            this._audioInstances.delete(instanceId);
        }
    }

    // 停止指定路径的音效（所有实例，兼容旧版本）
    stopAudioEff(path: string): void {
        this.stopAudioEffFromBundle('resources', path);
    }

    // 停止指定 Bundle 和路径的音效（所有实例）
    stopAudioEffFromBundle(bundleName: string, path: string): void {
        const instancesToRemove: string[] = [];

        this._audioInstances.forEach((audioInstance, instanceId) => {
            if (audioInstance.path === path && audioInstance.bundle === bundleName) {
                audioInstance.audioSource.stop();
                audioInstance.audioSource.node.destroy();
                instancesToRemove.push(instanceId);
            }
        });

        instancesToRemove.forEach(instanceId => this._audioInstances.delete(instanceId));
    }

    // 停止所有音效
    stopAllAudioEff(): void {
        this._audioInstances.forEach((audioInstance, instanceId) => {
            audioInstance.audioSource.stop();
            audioInstance.audioSource.node.destroy();
        });
        this._audioInstances.clear();
        this._audioGroups.clear();
    }

    // 设置背景音乐音量
    setMusicVolume(volume: number): void {
        this._musicVolume = Math.max(0, Math.min(1, volume));
        this.updateMusicVolume();
        this.saveSettings();
    }

    // 设置音效音量
    setAudioEffVolume(volume: number): void {
        this._sfxVolume = Math.max(0, Math.min(1, volume));
        this.updateAudioEffVolume();
        this.saveSettings();
    }

    // 清理所有音频
    cleanup(): void {
        this.stopMusic();
        this.stopAllAudioEff();
        this._audioCache.clear();
        // 销毁音频节点,常驻节点不要销毁
        // if (this._audioNode) {
        //     this._audioNode.destroy();
        //     this._audioNode = null;
        // }
    }

    // 背景音乐静音/取消静音
    setMusicMuted(muted: boolean): void {
        this._musicMuted = muted;
        this.updateMusicVolume();
        this.saveSettings();
    }

    // 音效静音/取消静音
    setAudioEffMuted(muted: boolean): void {
        this._sfxMuted = muted;
        this.updateAudioEffVolume();
        this.saveSettings();
    }

    // 切换背景音乐静音状态
    toggleMusicMute(): boolean {
        this.setMusicMuted(!this._musicMuted);
        return this._musicMuted;
    }

    // 切换音效静音状态
    toggleAudioEffMute(): boolean {
        this.setAudioEffMuted(!this._sfxMuted);
        return this._sfxMuted;
    }

    // 获取当前设置
    getMusicVolume(): number {
        return this._musicVolume;
    }

    getAudioEffVolume(): number {
        return this._sfxVolume;
    }

    isMusicMuted(): boolean {
        return this._musicMuted;
    }

    isAudioEffMuted(): boolean {
        return this._sfxMuted;
    }

    // 保存设置到本地存储
    saveSettings(): void {
        const settings = {
            musicVolume: this._musicVolume,
            sfxVolume: this._sfxVolume,
            musicMuted: this._musicMuted,
            sfxMuted: this._sfxMuted
        };
        localStorage.setItem('audio_settings', JSON.stringify(settings));
    }

    // 从本地存储加载设置
    loadSettings(): void {
        try {
            const settingsStr = localStorage.getItem('audio_settings');
            if (settingsStr) {
                const settings = JSON.parse(settingsStr);
                this._musicVolume = settings.musicVolume || 1.0;
                this._sfxVolume = settings.sfxVolume || 1.0;
                this._musicMuted = settings.musicMuted || false;
                this._sfxMuted = settings.sfxMuted || false;
            }

        } catch (error) {
            warn('加载音频设置失败，使用默认设置');
        }
    }

    // 
    stopAll(): void {
        this.stopMusic();
        this.stopAllAudioEff();
    }

    // 初始化音频节点
    private checkAudioNode(): void {
        if (!this._audioNode || !this._audioNode.isValid) {
            this._audioNode = new Node('AudioManager');
            // 设置为常驻节点，避免场景切换被销毁
            director.addPersistRootNode(this._audioNode);
        }
    }

    // 创建AudioSource组件
    private createAudioSource(): AudioSource {
        const node = new Node();
        node.parent = this._audioNode;
        let source = node.addComponent(AudioSource);
        source.playOnAwake = false;
        return source;
    }

    // 加载音频资源
    private async loadAudioClip(path: string, bundle: AssetManager.Bundle): Promise<AudioClip> {
        const cacheKey = `${bundle.name}_${path}`;

        // 如果已缓存，直接返回
        if (this._audioCache.has(cacheKey)) {
            return this._audioCache.get(cacheKey);
        }
        return new Promise<AudioClip>((resolve, reject) => {
            bundle.load(path, AudioClip, (err, audioClip) => {
                if (err) {
                    warn(`加载音频资源失败: ${bundle.name}/${path}`, err);
                    reject(err);
                    return;
                }

                this._audioCache.set(cacheKey, audioClip);
                resolve(audioClip);
            });
        });
    }

    // 更新背景音乐音量
    private updateMusicVolume(): void {
        if (this._bgmAudioSource) {
            const effectiveVolume = this._musicMuted ? 0 : this._musicVolume;
            this._bgmAudioSource.volume = effectiveVolume;
        }
    }

    // 更新所有音效音量
    private updateAudioEffVolume(): void {
        const effectiveVolume = this._sfxMuted ? 0 : this._sfxVolume;
        this._audioInstances.forEach(audioInstance => {
            audioInstance.audioSource.volume = effectiveVolume;
        });
    }

}
