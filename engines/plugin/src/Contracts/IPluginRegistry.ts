import type { PluginManifestDto } from "../Application/DTO";

export interface IPluginRegistry {
    registerPlugin(manifest: PluginManifestDto): void;
    unregisterPlugin(pluginId: string): void;
    getPlugin(pluginId: string): PluginManifestDto | undefined;
    getAllPlugins(): PluginManifestDto[];
    isInstalled(pluginId: string): boolean;
}
