import { ICommandHandler } from "@nova-x-ai/core";
import { InstallPluginCommand } from "../Commands/InstallPluginCommand";
import { PluginInstallationException } from "../../Domain/Exceptions/PluginInstallationException";

export class InstallPluginCommandHandler implements ICommandHandler<InstallPluginCommand> {
    constructor(
        private readonly pluginRegistry: import("@nova-x-ai/plugin").IPluginRegistry,
        private readonly dependencyResolver: import("@nova-x-ai/plugin").IDependencyGraphResolver,
        private readonly installer: import("@nova-x-ai/plugin").IPluginInstaller,
        private readonly signatureVerifier: import("@nova-x-ai/plugin").ISignatureVerifier,
        private readonly eventBus: import("@nova-x-ai/core").IEventBus
    ) {}

    async handle(command: InstallPluginCommand): Promise<void> {
        const manifest: import("@nova-x-ai/plugin").PluginManifestDto = {
            pluginId: command.pluginId,
            name: command.name,
            version: command.version,
            description: command.description,
            author: command.author,
            capabilities: command.capabilities,
            dependencies: command.dependencies,
            entryPoint: command.entryPoint,
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

        const conflicts = this.dependencyResolver.detectCircular(manifest);
        if (conflicts.length > 0) {
            throw new PluginInstallationException("Circular dependency detected: " + conflicts.join(", "));
        }

        const missingDeps = this.dependencyResolver.resolve(manifest).filter((d: any) => !d.resolved);
        if (missingDeps.length > 0) {
            throw new PluginInstallationException("Missing dependencies: " + missingDeps.map((d: any) => d.name).join(", "));
        }

        if (this.pluginRegistry.isInstalled(command.pluginId)) {
            throw new PluginInstallationException("Plugin already installed: " + command.pluginId);
        }

        const result = await this.installer.install(manifest, command.bundleData);
        if (!result.success) {
            throw new PluginInstallationException(result.message);
        }

        this.pluginRegistry.registerPlugin(manifest);
        await this.eventBus.publish({
            eventType: "EVT_PLUGIN_PluginInstalled",
            timestamp: Date.now(),
            correlationId: command.correlationId,
            pluginId: manifest.pluginId,
            version: manifest.version
        } as any);
    }
}
