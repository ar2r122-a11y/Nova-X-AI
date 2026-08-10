import type { ISecurityWorker } from "../../Contracts";

export class TokenAccumulator implements ISecurityWorker {
    private running = false;
    private tokens: string[] = [];

    async start(): Promise<void> {
        this.running = true;
        this.accumulate();
    }

    async stop(): Promise<void> {
        this.running = false;
    }

    isRunning(): boolean {
        return this.running;
    }

    getWorkerName(): string {
        return "TokenAccumulator";
    }

    private async accumulate(): Promise<void> {
        while (this.running) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}
