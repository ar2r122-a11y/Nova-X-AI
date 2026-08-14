export interface IRecoveryWorker {
    recover(pluginId: string): Promise<void>;
    isRecovering(pluginId: string): boolean;
}
