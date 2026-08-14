import { ICommand } from "@nova-x-ai/core";

export class DisablePluginCommand implements ICommand {
    constructor(
        public readonly pluginId: string,
        public readonly correlationId: string
    ) {}
}
