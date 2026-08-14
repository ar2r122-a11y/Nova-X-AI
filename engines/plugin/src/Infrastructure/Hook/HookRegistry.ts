import type { IHookRegistry } from "../../Contracts/IHookRegistry";

export class HookRegistry implements IHookRegistry {
    private hooks: Map<string, Map<string, (payload: unknown) => Promise<void>>> = new Map();

    registerHook(pluginId: string, hookName: string, handler: (payload: unknown) => Promise<void>): void {
        if (!this.hooks.has(pluginId)) {
            this.hooks.set(pluginId, new Map());
        }
        this.hooks.get(pluginId)!.set(hookName, handler);
    }

    unregisterHook(pluginId: string, hookName: string): void {
        const pluginHooks = this.hooks.get(pluginId);
        if (pluginHooks) {
            pluginHooks.delete(hookName);
        }
    }

    getHooks(pluginId: string): string[] {
        const pluginHooks = this.hooks.get(pluginId);
        return pluginHooks ? Array.from(pluginHooks.keys()) : [];
    }

    getAllHooks(): Map<string, string[]> {
        const result = new Map<string, string[]>();
        for (const [pluginId, pluginHooks] of this.hooks) {
            result.set(pluginId, Array.from(pluginHooks.keys()));
        }
        return result;
    }

    async triggerHook(hookName: string, payload: unknown): Promise<void> {
        for (const pluginHooks of this.hooks.values()) {
            const handler = pluginHooks.get(hookName);
            if (handler) {
                try {
                    await handler(payload);
                } catch (error) {
                    console.error("Hook handler failed for", hookName, error);
                }
            }
        }
    }
}