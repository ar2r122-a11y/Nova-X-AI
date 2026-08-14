export interface IHotReloadManager {
    registerForHotReload(pluginId: string): void;
    unregisterForHotReload(pluginId: string): void;
    reload(pluginId: string): Promise<void>;
}
