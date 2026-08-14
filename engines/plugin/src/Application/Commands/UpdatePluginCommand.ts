import { ICommand } from "@nova-x-ai/core";

export class UpdatePluginCommand implements ICommand {
    constructor(
        public readonly pluginId: string,
        public readonly newVersion: string,
        public readonly correlationId: string,
        public readonly signature?: string,
        public readonly bundleData?: unknown
    ) {}
}
