import { ICommandHandler } from "@nova-x-ai/core";
import { EnablePluginCommand } from "../Commands/EnablePluginCommand";
import { PluginInstallationException } from "../../Domain/Exceptions/PluginInstallationException";

export class EnablePluginCommandHandler implements ICommandHandler<EnablePluginCommand> {
    constructor(
        private readonly pluginRegistry: import("@nova-x-ai/plugin").IPluginRegistry,
        private readonly sandbox: import("@nova-x-ai/plugin").IPluginSandbox,
        private readonly eventBus: import("@nova-x-ai/core").IEventBus
    ) {}

    async handle(command: EnablePluginCommand): Promise<void> {
        const manifest = this.pluginRegistry.getPlugin(command.pluginId);
        if (!manifest) {
            throw new PluginInstallationException("Plugin not installed: " + command.pluginId);
        }
        await this.sandbox.load(manifest);
        await this.eventBus.publish({
            eventType: "EVT_PLUGIN_PluginEnabled",
            timestamp: Date.now(),
            correlationId: command.correlationId,
            pluginId: command.pluginId
        } as any);
    }
}
