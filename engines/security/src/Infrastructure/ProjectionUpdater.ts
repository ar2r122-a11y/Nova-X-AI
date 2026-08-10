export class SecurityProjectionUpdater {
    private running = false;

    async start(): Promise<void> {
        this.running = true;
        this.update();
    }

    async stop(): Promise<void> {
        this.running = false;
    }

    isRunning(): boolean {
        return this.running;
    }

    getWorkerName(): string {
        return "SecurityProjectionUpdater";
    }

    private async update(): Promise<void> {
        while (this.running) {
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}
