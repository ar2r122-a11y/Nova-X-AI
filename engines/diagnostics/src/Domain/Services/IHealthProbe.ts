export interface IHealthProbe {
    readonly name: string;
    check(): Promise<{ healthy: boolean; message?: string; durationMs: number }>;
}

export interface IEngineHealthProbe {
    readonly engineName: string;
    check(): Promise<{ healthy: boolean; message?: string; durationMs: number }>;
}
