export interface IPluginIsolatedStorageAdapter {
    savePluginData(pluginId: string, key: string, data: unknown): Promise<void>;
    loadPluginData(pluginId: string, key: string): Promise<unknown | null>;
    deletePluginData(pluginId: string, key: string): Promise<void>;
    clearPluginData(pluginId: string): Promise<void>;
}
