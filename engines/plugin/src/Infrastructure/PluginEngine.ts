import type { IEventBus } from "@nova-x-ai/core";
import { PluginId } from "../Domain/ValueObjects/PluginId";
import { PluginInstalledEvent, PluginUnloadedEvent, PluginEnabledEvent, PluginDisabledEvent, PluginUpdatedEvent } from "../Domain/Events";

export class PluginEngineFacade {
    readonly eventBus: IEventBus;
    private registry: import("@nova-x-ai/plugin").IPluginRegistry;
    private sandbox: import("@nova-x-ai/plugin").IPluginSandbox;

    constructor(
        eventBus: IEventBus,
        registry: import("@nova-x-ai/plugin").IPluginRegistry,
        sandbox: import("@nova-x-ai/plugin").IPluginSandbox
    ) {
        this.eventBus = eventBus;
        this.registry = registry;
        this.sandbox = sandbox;
    }

    async installPlugin(command: any): Promise<import("@nova-x-ai/plugin").PluginInstallResultDto> {
        const result = { success: false as boolean, pluginId: command.pluginId, message: "" };
        try {
            const manifest: import("@nova-x-ai/plugin").PluginManifestDto = {
                pluginId: command.pluginId,
                name: command.name,
                version: command.version,
                description: command.description,
                author: command.author,
                capabilities: command.capabilities,
                dependencies: command.dependencies,
                entryPoint: command.entryPoint,
                signature: command.signature
            };
            this.registry.registerPlugin(manifest);
            result.success = true;
            result.message = "Plugin installed successfully.";
            await this.eventBus.publish(new PluginInstalledEvent(PluginId.create(manifest.pluginId), Date.now(), command.correlationId));
        } catch (error) {
            result.message = error instanceof Error ? error.message : "Unknown error";
        }
        return result;
    }

    async uninstallPlugin(pluginId: string): Promise<void> {
        if (!this.registry.isInstalled(pluginId)) {
            throw new Error("Plugin not installed: " + pluginId);
        }
        await this.sandbox.unload(pluginId);
        this.registry.unregisterPlugin(pluginId);
        await this.eventBus.publish(new PluginUnloadedEvent(PluginId.create(pluginId), Date.now(), ""));
    }

    async enablePlugin(pluginId: string): Promise<void> {
        const manifest = this.registry.getPlugin(pluginId);
        if (!manifest) throw new Error("Plugin not installed: " + pluginId);
        await this.sandbox.load(manifest);
        await this.eventBus.publish(new PluginEnabledEvent(PluginId.create(pluginId), Date.now(), ""));
    }

    async disablePlugin(pluginId: string): Promise<void> {
        await this.sandbox.unload(pluginId);
        await this.eventBus.publish(new PluginDisabledEvent(PluginId.create(pluginId), Date.now(), ""));
    }

    async updatePlugin(command: any): Promise<import("@nova-x-ai/plugin").PluginInstallResultDto> {
        const result = { success: false as boolean, pluginId: command.pluginId, message: "" };
        try {
            const existing = this.registry.getPlugin(command.pluginId);
            if (!existing) throw new Error("Plugin not installed: " + command.pluginId);
            await this.sandbox.unload(command.pluginId);
            this.registry.unregisterPlugin(command.pluginId);
            const manifest: import("@nova-x-ai/plugin").PluginManifestDto = {
                pluginId: command.pluginId,
                name: existing.name,
                version: command.newVersion,
                description: existing.description,
                author: existing.author,
                capabilities: existing.capabilities,
                dependencies: existing.dependencies,
                entryPoint: existing.entryPoint,
                signature: command.signature
            };
            this.registry.registerPlugin(manifest);
            await this.sandbox.load(manifest);
            result.success = true;
            result.message = "Plugin updated successfully.";
            await this.eventBus.publish(new PluginUpdatedEvent(PluginId.create(command.pluginId), existing.version, command.newVersion, Date.now(), ""));
        } catch (error) {
            result.message = error instanceof Error ? error.message : "Unknown error";
        }
        return result;
    }

    listInstalledPlugins(): import("@nova-x-ai/plugin").PluginManifestDto[] {
        return this.registry.getAllPlugins();
    }

    getPluginManifest(pluginId: string): import("@nova-x-ai/plugin").PluginManifestDto | null {
        return this.registry.getPlugin(pluginId) ?? null;
    }

    getPluginCapabilities(pluginId: string): import("@nova-x-ai/plugin").PluginCapabilityDto[] {
        const manifest = this.registry.getPlugin(pluginId);
        if (!manifest) return [];
        return manifest.capabilities.map((c: string) => ({ name: c, description: "", risk: "low" }));
    }

    getInstalledPlugins(): import("@nova-x-ai/plugin").PluginStatusDto[] {
        const plugins = this.registry.getAllPlugins();
        return plugins.map((p: any) => ({
            pluginId: p.pluginId,
            status: "Installed",
            failureCount: 0,
            lastActiveAt: Date.now()
        }));
    }

    async initialize(): Promise<void> {}
    async shutdown(): Promise<void> {}
}
