import type { ICrossEnginePluginCoordinator } from "../../Contracts/ICrossEnginePluginCoordinator";

export class CrossEnginePluginCoordinator implements ICrossEnginePluginCoordinator {
    private hookPoints: Map<string, Map<string, (payload: unknown) => Promise<void>>> = new Map();

    registerHookPoint(engineName: string, hookName: string, handler: (payload: unknown) => Promise<void>): void {
        if (!this.hookPoints.has(engineName)) {
            this.hookPoints.set(engineName, new Map());
        }
        this.hookPoints.get(engineName)!.set(hookName, handler);
    }

    unregisterHookPoint(engineName: string, hookName: string): void {
        const engineHooks = this.hookPoints.get(engineName);
        if (engineHooks) {
            engineHooks.delete(hookName);
        }
    }

    getHookPoints(engineName: string): string[] {
        const engineHooks = this.hookPoints.get(engineName);
        return engineHooks ? Array.from(engineHooks.keys()) : [];
    }

    async publishToEngine(engineName: string, event: unknown): Promise<void> {
        const engineHooks = this.hookPoints.get(engineName);
        if (!engineHooks) return;
        for (const handler of engineHooks.values()) {
            try {
                await handler(event);
            } catch (error) {
                console.error("Hook handler failed", error);
            }
        }
    }
}