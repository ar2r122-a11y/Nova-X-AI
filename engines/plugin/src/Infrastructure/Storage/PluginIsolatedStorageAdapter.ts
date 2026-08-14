import type { IPluginIsolatedStorageAdapter } from "../../Contracts/IPluginIsolatedStorageAdapter";

export class PluginIsolatedStorageAdapter implements IPluginIsolatedStorageAdapter {
    private store: Map<string, Map<string, unknown>> = new Map();

    async savePluginData(pluginId: string, key: string, data: unknown): Promise<void> {
        if (!this.store.has(pluginId)) {
            this.store.set(pluginId, new Map());
        }
        this.store.get(pluginId)!.set(key, data);
    }

    async loadPluginData(pluginId: string, key: string): Promise<unknown | null> {
        const pluginStore = this.store.get(pluginId);
        if (!pluginStore) return null;
        return pluginStore.get(key) ?? null;
    }

    async deletePluginData(pluginId: string, key: string): Promise<void> {
        const pluginStore = this.store.get(pluginId);
        if (pluginStore) {
            pluginStore.delete(key);
        }
    }

    async clearPluginData(pluginId: string): Promise<void> {
        this.store.delete(pluginId);
    }
}