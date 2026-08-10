export interface IWorldHealthCheck {
    readonly name: string;
    check(): Promise<{ healthy: boolean; message?: string; durationMs: number }>;
}
