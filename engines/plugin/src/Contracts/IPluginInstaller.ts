import type { PluginManifestDto, PluginInstallResultDto } from "../Application/DTO";

export interface IPluginInstaller {
    install(manifest: PluginManifestDto, bundle: unknown): Promise<PluginInstallResultDto>;
    uninstall(pluginId: string): Promise<void>;
    update(manifest: PluginManifestDto, bundle: unknown): Promise<PluginInstallResultDto>;
}
