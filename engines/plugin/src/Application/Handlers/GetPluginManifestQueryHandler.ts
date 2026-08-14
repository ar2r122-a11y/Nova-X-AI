import { IQueryHandler } from "@nova-x-ai/core";
import { GetPluginManifestQuery } from "../Queries/GetPluginManifestQuery";
import { PluginManifestDto } from "../DTO/PluginManifestDto";

export class GetPluginManifestQueryHandler implements IQueryHandler<GetPluginManifestQuery, PluginManifestDto | null> {
    constructor(private readonly pluginRegistry: import("@nova-x-ai/plugin").IPluginRegistry) {}

    async handle(query: GetPluginManifestQuery): Promise<PluginManifestDto | null> {
        return this.pluginRegistry.getPlugin(query.pluginId) ?? null;
    }
}
