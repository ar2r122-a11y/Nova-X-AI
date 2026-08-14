export interface ICrossEnginePluginCoordinator {
    registerHookPoint(engineName: string, hookName: string, handler: (payload: unknown) => Promise<void>): void;
    unregisterHookPoint(engineName: string, hookName: string): void;
    getHookPoints(engineName: string): string[];
    publishToEngine(engineName: string, event: unknown): Promise<void>;
}
