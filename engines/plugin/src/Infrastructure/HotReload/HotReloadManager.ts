import type { IHotReloadManager } from "../../Contracts/IHotReloadManager";
import type { IEventBus } from "@nova-x-ai/core";

export class HotReloadManager implements IHotReloadManager {
    private registeredPlugins: Set<string> = new Set();
    private readonly eventBus: IEventBus;

    constructor(eventBus: IEventBus) {
        this.eventBus = eventBus;
    }

    registerForHotReload(pluginId: string): void {
        this.registeredPlugins.add(pluginId);
    }

    unregisterForHotReload(pluginId: string): void {
        this.registeredPlugins.delete(pluginId);
    }

    async reload(pluginId: string): Promise<void> {
        if (!this.registeredPlugins.has(pluginId)) {
            throw new Error("Plugin not registered for hot reload: " + pluginId);
        }
        await this.eventBus.publish({
            eventType: "EVT_PLUGIN_HotReloaded",
            timestamp: Date.now(),
            correlationId: "",
            pluginId
        } as any);
    }
}