export interface IPluginSandbox {
    load(manifest: PluginManifest): Promise<void>;
    unload(pluginId: string): Promise<void>;
    execute(pluginId: string, method: string, payload: unknown): Promise<unknown>;
    isLoaded(pluginId: string): boolean;
    terminate(pluginId: string): void;
}

export interface PluginManifest {
    readonly pluginId: string;
    readonly name: string;
    readonly version: string;
    readonly entryPoint: string;
    readonly capabilities: string[];
}
