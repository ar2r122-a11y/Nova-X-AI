import { IQueryHandler } from "@nova-x-ai/core";
import { ListInstalledPluginsQuery } from "../Queries/ListInstalledPluginsQuery";
import { PluginManifestDto } from "../DTO/PluginManifestDto";

export class ListInstalledPluginsQueryHandler implements IQueryHandler<ListInstalledPluginsQuery, PluginManifestDto[]> {
    constructor(private readonly pluginRegistry: import("@nova-x-ai/plugin").IPluginRegistry) {}

    async handle(_query: ListInstalledPluginsQuery): Promise<PluginManifestDto[]> {
        return this.pluginRegistry.getAllPlugins();
    }
}
