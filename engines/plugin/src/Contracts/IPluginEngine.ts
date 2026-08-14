import type { IEventBus } from "@nova-x-ai/core";
import type { PluginManifestDto, PluginInstallResultDto, PluginCapabilityDto, PluginStatusDto } from "../Application/DTO";

export interface IPluginEngine {
    readonly eventBus: IEventBus;
    installPlugin(command: PluginInstallCommand): Promise<PluginInstallResultDto>;
    uninstallPlugin(pluginId: string): Promise<void>;
    enablePlugin(pluginId: string): Promise<void>;
    disablePlugin(pluginId: string): Promise<void>;
    updatePlugin(command: PluginUpdateCommand): Promise<PluginInstallResultDto>;
    listInstalledPlugins(): PluginManifestDto[];
    getPluginManifest(pluginId: string): PluginManifestDto | null;
    getPluginCapabilities(pluginId: string): PluginCapabilityDto[];
    getInstalledPlugins(): PluginStatusDto[];
    initialize(): Promise<void>;
    shutdown(): Promise<void>;
}

export interface PluginInstallCommand {
    readonly bundle: unknown;
    readonly manifest: PluginManifestDto;
    readonly claims: { roles: string[]; permissions: string[] };
}

export interface PluginUpdateCommand {
    readonly pluginId: string;
    readonly bundle: unknown;
    readonly manifest: PluginManifestDto;
    readonly claims: { roles: string[]; permissions: string[] };
}
