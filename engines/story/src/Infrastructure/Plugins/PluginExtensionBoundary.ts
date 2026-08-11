import type { IPluginExtensionBoundary } from "../../Contracts/IPluginExtensionBoundary";
import type { StoryEngineAclTranslator } from "../ACL/StoryEngineAclTranslator";

export class PluginExtensionBoundary implements IPluginExtensionBoundary {
    private extensionPoints: Map<string, (payload: unknown) => Promise<void>> = new Map();
    private miniGames: unknown[] = [];

    constructor(private readonly acl: StoryEngineAclTranslator) {}

    registerExtensionPoint(name: string, handler: (payload: unknown) => Promise<void>): void {
        this.extensionPoints.set(name, handler);
    }

    async triggerExtensionPoint(name: string, payload: unknown): Promise<void> {
        const handler = this.extensionPoints.get(name);
        if (!handler) {
            throw new Error(`Extension point not found: ${name}`);
        }
        this.acl.validateExternalData(payload, {});
        await handler(payload);
    }

    registerMiniGame(extension: unknown): void {
        this.miniGames.push(extension);
    }

    getRegisteredExtensions(): string[] {
        return Array.from(this.extensionPoints.keys());
    }
}
