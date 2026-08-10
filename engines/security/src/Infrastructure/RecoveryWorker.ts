export class SecurityRecoveryWorker {
    private running = false;

    async start(): Promise<void> {
        this.running = true;
        this.recover();
    }

    async stop(): Promise<void> {
        this.running = false;
    }

    isRunning(): boolean {
        return this.running;
    }

    getWorkerName(): string {
        return "SecurityRecoveryWorker";
    }

    private async recover(): Promise<void> {
        while (this.running) {
            await new Promise(resolve => setTimeout(resolve, 30000));
        }
    }
}
