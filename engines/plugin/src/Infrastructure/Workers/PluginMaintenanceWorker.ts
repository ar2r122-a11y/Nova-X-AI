export class PluginMaintenanceWorker {
    private running = false;

    start(): void {
        this.running = true;
    }

    stop(): void {
        this.running = false;
    }

    isRunning(): boolean {
        return this.running;
    }

    getWorkerName(): string {
        return "PluginMaintenanceWorker";
    }
}
