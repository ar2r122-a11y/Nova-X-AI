import { IQuery } from "@nova-x-ai/core";

export class GetPluginManifestQuery implements IQuery {
    constructor(
        public readonly pluginId: string
    ) {}
}
