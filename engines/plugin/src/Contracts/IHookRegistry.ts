export interface IHookRegistry {
    registerHook(pluginId: string, hookName: string, handler: (payload: unknown) => Promise<void>): void;
    unregisterHook(pluginId: string, hookName: string): void;
    getHooks(pluginId: string): string[];
    getAllHooks(): Map<string, string[]>;
    triggerHook(hookName: string, payload: unknown): Promise<void>;
}
