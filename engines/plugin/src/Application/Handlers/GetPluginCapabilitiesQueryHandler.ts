import { IQueryHandler } from "@nova-x-ai/core";
import { GetPluginCapabilitiesQuery } from "../Queries/GetPluginCapabilitiesQuery";
import { PluginCapabilityDto } from "../DTO/PluginCapabilityDto";

export class GetPluginCapabilitiesQueryHandler implements IQueryHandler<GetPluginCapabilitiesQuery, PluginCapabilityDto[]> {
    constructor(private readonly pluginRegistry: import("@nova-x-ai/plugin").IPluginRegistry) {}

    async handle(query: GetPluginCapabilitiesQuery): Promise<PluginCapabilityDto[]> {
        const manifest = this.pluginRegistry.getPlugin(query.pluginId);
        if (!manifest) return [];
        return manifest.capabilities.map((c: string) => ({ name: c, description: "", risk: "low" }));
    }
}
