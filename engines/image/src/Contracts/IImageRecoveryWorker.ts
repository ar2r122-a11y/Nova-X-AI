export interface IImageRecoveryWorker {
    recover(imageId: string): Promise<boolean>;
    isRecovering(imageId: string): boolean;
    getRecoveryStatus(imageId: string): { status: string; attempts: number; maxAttempts: number };
}
