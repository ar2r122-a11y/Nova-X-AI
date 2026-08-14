import { ICommandHandler } from "@nova-x-ai/core";
import { UninstallPluginCommand } from "../Commands/UninstallPluginCommand";
import { PluginInstallationException } from "../../Domain/Exceptions/PluginInstallationException";

export class UninstallPluginCommandHandler implements ICommandHandler<UninstallPluginCommand> {
    constructor(
        private readonly pluginRegistry: import("@nova-x-ai/plugin").IPluginRegistry,
        private readonly installer: import("@nova-x-ai/plugin").IPluginInstaller,
        private readonly eventBus: import("@nova-x-ai/core").IEventBus
    ) {}

    async handle(command: UninstallPluginCommand): Promise<void> {
        if (!this.pluginRegistry.isInstalled(command.pluginId)) {
            throw new PluginInstallationException("Plugin not installed: " + command.pluginId);
        }
        await this.installer.uninstall(command.pluginId);
        this.pluginRegistry.unregisterPlugin(command.pluginId);
        await this.eventBus.publish({
            eventType: "EVT_PLUGIN_PluginUnloaded",
            timestamp: Date.now(),
            correlationId: command.correlationId,
            pluginId: command.pluginId
        } as any);
    }
}
