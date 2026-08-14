import { InstallPluginCommand } from "../Commands/InstallPluginCommand";
import { PluginInstallationException } from "../../Domain/Exceptions/PluginInstallationException";

export class InstallPluginCommandValidator {
    validate(command: InstallPluginCommand): void {
        if (!command.pluginId || command.pluginId.trim() === "") {
            throw new PluginInstallationException("PluginId is required.");
        }
        if (!command.name || command.name.trim() === "") {
            throw new PluginInstallationException("Plugin name is required.");
        }
        if (!command.version || command.version.trim() === "") {
            throw new PluginInstallationException("Plugin version is required.");
        }
        if (!command.entryPoint || command.entryPoint.trim() === "") {
            throw new PluginInstallationException("Plugin entryPoint is required.");
        }
        if (!command.capabilities || command.capabilities.length === 0) {
            throw new PluginInstallationException("Plugin must declare at least one capability.");
        }
    }
}
