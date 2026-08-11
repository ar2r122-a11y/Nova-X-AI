export interface IPluginExtensionBoundary {
    registerExtensionPoint(name: string, handler: (payload: unknown) => Promise<void>): void;
    triggerExtensionPoint(name: string, payload: unknown): Promise<void>;
    registerMiniGame(extension: unknown): void;
}
