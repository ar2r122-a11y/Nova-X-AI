import type { IPluginSandbox } from "../../Contracts/IPluginSandbox";
import { PluginManifestDto } from "../../Application/DTO/PluginManifestDto";
import { PluginSandboxCrashedEvent } from "../../Domain/Events/PluginSandboxCrashedEvent";
import { PluginId } from "../../Domain/ValueObjects/PluginId";
import type { IEventBus } from "@nova-x-ai/core";

export class SandboxLoader implements IPluginSandbox {
    private loadedPlugins: Map<string, { worker: Worker; manifest: PluginManifestDto }> = new Map();
    private readonly eventBus: IEventBus;

    constructor(eventBus: IEventBus) {
        this.eventBus = eventBus;
    }

    async load(manifest: PluginManifestDto): Promise<void> {
        if (this.loadedPlugins.has(manifest.pluginId)) {
            throw new Error("Plugin already loaded: " + manifest.pluginId);
        }
        const worker = new Worker(new URL("../../../Presentation/PluginSandboxBootstrapper.ts", import.meta.url), { type: "module" });
        const channel = new MessageChannel();
        worker.postMessage({ type: "init", manifest, port: channel.port1 }, [channel.port1]);
        this.loadedPlugins.set(manifest.pluginId, { worker, manifest });
    }

    async unload(pluginId: string): Promise<void> {
        const entry = this.loadedPlugins.get(pluginId);
        if (entry) {
            entry.worker.terminate();
            this.loadedPlugins.delete(pluginId);
        }
    }

    async execute(pluginId: string, method: string, payload: unknown): Promise<unknown> {
        const entry = this.loadedPlugins.get(pluginId);
        if (!entry) throw new Error("Plugin not loaded: " + pluginId);
        return new Promise((resolve, reject) => {
            const channel = new MessageChannel();
            const timeout = setTimeout(() => reject(new Error("Plugin execution timeout")), 5000);
            channel.port1.onmessage = (event: MessageEvent) => {
                clearTimeout(timeout);
                resolve(event.data.result);
            };
            entry.worker.postMessage({ type: "execute", method, payload, port: channel.port2 }, [channel.port2]);
        });
    }

    isLoaded(pluginId: string): boolean {
        return this.loadedPlugins.has(pluginId);
    }

    terminate(pluginId: string): void {
        const entry = this.loadedPlugins.get(pluginId);
        if (entry) {
            entry.worker.terminate();
            this.loadedPlugins.delete(pluginId);
        }
    }

    handleWorkerError(pluginId: string): void {
        this.eventBus.publish(new PluginSandboxCrashedEvent(PluginId.create(pluginId), "Worker crashed", Date.now(), ""));
    }
}