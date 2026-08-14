import { IQueryHandler } from "@nova-x-ai/core";
import { GetInstalledPluginsQuery } from "../Queries/GetInstalledPluginsQuery";
import { PluginManifestDto } from "../DTO/PluginManifestDto";
import { PluginStatusDto } from "../DTO/PluginStatusDto";

export class GetInstalledPluginsQueryHandler implements IQueryHandler<GetInstalledPluginsQuery, PluginStatusDto[]> {
    constructor(private readonly pluginRegistry: import("@nova-x-ai/plugin").IPluginRegistry) {}

    async handle(_query: GetInstalledPluginsQuery): Promise<PluginStatusDto[]> {
        const plugins = this.pluginRegistry.getAllPlugins();
        return plugins.map((p: PluginManifestDto) => ({
            pluginId: p.pluginId,
            status: "Installed",
            failureCount: 0,
            lastActiveAt: Date.now()
        }));
    }
}
