import { ICommandHandler } from "@nova-x-ai/core";
import { DisablePluginCommand } from "../Commands/DisablePluginCommand";
import { PluginInstallationException } from "../../Domain/Exceptions/PluginInstallationException";

export class DisablePluginCommandHandler implements ICommandHandler<DisablePluginCommand> {
    constructor(
        private readonly pluginRegistry: import("@nova-x-ai/plugin").IPluginRegistry,
        private readonly sandbox: import("@nova-x-ai/plugin").IPluginSandbox,
        private readonly eventBus: import("@nova-x-ai/core").IEventBus
    ) {}

    async handle(command: DisablePluginCommand): Promise<void> {
        if (!this.pluginRegistry.isInstalled(command.pluginId)) {
            throw new PluginInstallationException("Plugin not installed: " + command.pluginId);
        }
        await this.sandbox.unload(command.pluginId);
        await this.eventBus.publish({
            eventType: "EVT_PLUGIN_PluginDisabled",
            timestamp: Date.now(),
            correlationId: command.correlationId,
            pluginId: command.pluginId
        } as any);
    }
}
