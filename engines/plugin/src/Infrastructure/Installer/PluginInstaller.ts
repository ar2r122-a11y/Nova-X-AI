import type { IPluginInstaller } from "../../Contracts/IPluginInstaller";
import { PluginManifestDto } from "../../Application/DTO/PluginManifestDto";
import { PluginInstallResultDto } from "../../Application/DTO/PluginInstallResultDto";

export class PluginInstaller implements IPluginInstaller {
    async install(manifest: PluginManifestDto, _bundle?: ArrayBuffer): Promise<PluginInstallResultDto> {
        return { success: true, pluginId: manifest.pluginId, message: "Installed" };
    }

    async uninstall(_pluginId: string): Promise<void> {
    }

    async update(manifest: PluginManifestDto, _bundle?: ArrayBuffer): Promise<PluginInstallResultDto> {
        return { success: true, pluginId: manifest.pluginId, message: "Updated" };
    }
}