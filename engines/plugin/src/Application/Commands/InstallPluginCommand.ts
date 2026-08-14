import { ICommand } from "@nova-x-ai/core";

export class InstallPluginCommand implements ICommand {
    constructor(
        public readonly pluginId: string,
        public readonly name: string,
        public readonly version: string,
        public readonly description: string,
        public readonly author: string,
        public readonly capabilities: string[],
        public readonly dependencies: { name: string; version: string }[],
        public readonly entryPoint: string,
        public readonly correlationId: string,
        public readonly signature?: string,
        public readonly bundleData?: unknown
    ) {}
}
