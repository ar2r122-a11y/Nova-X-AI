import type { IHealthProbe } from "../Domain/Services/IHealthProbe";
import type { IEngineHealthProbe } from "../Domain/Services/IHealthProbe";

export class HealthProbe implements IHealthProbe {
    readonly name: string;

    private readonly probes: IEngineHealthProbe[] = [];

    constructor(name: string) {
        this.name = name;
    }

    register(probe: IEngineHealthProbe): void {
        this.probes.push(probe);
    }

    async check(): Promise<{ healthy: boolean; message?: string; durationMs: number }> {
        const start = Date.now();
        let hasUnhealthy = false;
        let lastMessage: string | undefined;

        for (const probe of this.probes) {
            try {
                const result = await probe.check();
                if (!result.healthy) {
                    hasUnhealthy = true;
                }
                if (!result.healthy && result.message) {
                    lastMessage = result.message;
                }
            } catch (error) {
                hasUnhealthy = true;
                lastMessage = error instanceof Error ? error.message : "Unknown error";
            }
        }

        return {
            healthy: !hasUnhealthy,
            message: lastMessage,
            durationMs: Date.now() - start
        };
    }

    async probeAll(): Promise<Array<{
        engineName: string;
        healthy: boolean;
        durationMs: number;
        message: string | null;
    }>> {
        const results: Array<{
            engineName: string;
            healthy: boolean;
            durationMs: number;
            message: string | null;
        }> = [];

        for (const probe of this.probes) {
            const start = Date.now();
            try {
                const result = await probe.check();
                results.push({
                    engineName: probe.engineName,
                    healthy: result.healthy,
                    durationMs: Date.now() - start,
                    message: result.message ?? null
                });
            } catch (error) {
                results.push({
                    engineName: probe.engineName,
                    healthy: false,
                    durationMs: Date.now() - start,
                    message: error instanceof Error ? error.message : "Unknown error"
                });
            }
        }

        return results;
    }
}
