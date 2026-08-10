import type { ISecurityWorker } from "../../Contracts";

export class IdentityChunkAssembler implements ISecurityWorker {
    private running = false;
    private chunks: Map<string, unknown[]> = new Map();

    async start(): Promise<void> {
        this.running = true;
        this.assemble();
    }

    async stop(): Promise<void> {
        this.running = false;
    }

    isRunning(): boolean {
        return this.running;
    }

    getWorkerName(): string {
        return "IdentityChunkAssembler";
    }

    private async assemble(): Promise<void> {
        while (this.running) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}
