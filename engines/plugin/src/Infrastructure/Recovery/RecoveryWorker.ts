import type { IRecoveryWorker } from "../../Contracts/IRecoveryWorker";

export class RecoveryWorker implements IRecoveryWorker {
    private recovering: Set<string> = new Set();

    async recover(pluginId: string): Promise<void> {
        this.recovering.add(pluginId);
        await new Promise((resolve) => setTimeout(resolve, 100));
        this.recovering.delete(pluginId);
    }

    isRecovering(pluginId: string): boolean {
        return this.recovering.has(pluginId);
    }
}