import type { IPluginRegistry } from "../../Contracts/IPluginRegistry";
import { PluginManifestDto } from "../../Application/DTO/PluginManifestDto";

export class PluginRepositoryImpl implements IPluginRegistry {
    private plugins: Map<string, PluginManifestDto> = new Map();

    registerPlugin(manifest: PluginManifestDto): void {
        this.plugins.set(manifest.pluginId, manifest);
    }

    unregisterPlugin(pluginId: string): void {
        this.plugins.delete(pluginId);
    }

    getPlugin(pluginId: string): PluginManifestDto | undefined {
        return this.plugins.get(pluginId);
    }

    getAllPlugins(): PluginManifestDto[] {
        return Array.from(this.plugins.values());
    }

    isInstalled(pluginId: string): boolean {
        return this.plugins.has(pluginId);
    }
}