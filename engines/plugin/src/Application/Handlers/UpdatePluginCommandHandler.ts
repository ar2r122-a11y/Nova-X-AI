import { ICommandHandler } from "@nova-x-ai/core";
import { UpdatePluginCommand } from "../Commands/UpdatePluginCommand";
import { PluginInstallationException } from "../../Domain/Exceptions/PluginInstallationException";

export class UpdatePluginCommandHandler implements ICommandHandler<UpdatePluginCommand> {
    constructor(
        private readonly pluginRegistry: import("@nova-x-ai/plugin").IPluginRegistry,
        private readonly installer: import("@nova-x-ai/plugin").IPluginInstaller,
        private readonly sandbox: import("@nova-x-ai/plugin").IPluginSandbox,
        private readonly signatureVerifier: import("@nova-x-ai/plugin").ISignatureVerifier,
        private readonly eventBus: import("@nova-x-ai/core").IEventBus
    ) {}

    async handle(command: UpdatePluginCommand): Promise<void> {
        const existing = this.pluginRegistry.getPlugin(command.pluginId);
        if (!existing) {
            throw new PluginInstallationException("Plugin not installed: " + command.pluginId);
        }

        const manifest: import("@nova-x-ai/plugin").PluginManifestDto = {
            pluginId: command.pluginId,
            name: existing.name,
            version: command.newVersion,
            description: existing.description,
            author: existing.author,
            capabilities: existing.capabilities,
            dependencies: existing.dependencies,
            entryPoint: existing.entryPoint,
            signature: command.signature
        };

        if (command.signature) {
            const manifestData = JSON.stringify(manifest);
            const sigBytes = new Uint8Array(command.signature.match(/.{1,2}/g)!.map((b: string) => parseInt(b, 16)));
            const valid = await this.signatureVerifier.verifyManifestSignature(manifestData, sigBytes);
            if (!valid) {
                throw new PluginInstallationException("Plugin manifest signature verification failed.");
            }
        }

        await this.sandbox.unload(command.pluginId);
        const result = await this.installer.update(manifest, command.bundleData);
        if (!result.success) {
            throw new PluginInstallationException(result.message);
        }
        this.pluginRegistry.unregisterPlugin(command.pluginId);
        this.pluginRegistry.registerPlugin(manifest);
        await this.sandbox.load(manifest);
        await this.eventBus.publish({
            eventType: "EVT_PLUGIN_PluginUpdated",
            timestamp: Date.now(),
            correlationId: command.correlationId,
            pluginId: command.pluginId,
            version: command.newVersion
        } as any);
    }
}
