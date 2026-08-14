import { IQuery } from "@nova-x-ai/core";

export class GetPluginCapabilitiesQuery implements IQuery {
    constructor(
        public readonly pluginId: string
    ) {}
}
