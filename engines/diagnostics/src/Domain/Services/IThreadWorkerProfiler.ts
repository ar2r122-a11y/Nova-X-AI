export interface IThreadWorkerProfiler {
    startProfile(workerName: string): Promise<string>;

    stopProfile(profileId: string): Promise<{
        profileId: string;
        workerName: string;
        durationMs: number;
        samples: Array<{
            timestamp: number;
            cpuUsagePercent: number;
            memoryUsageBytes: number;
        }>;
    }>;

    getActiveProfiles(): Promise<string[]>;

    getAllProfiles(workerName?: string): Promise<Array<{
        profileId: string;
        workerName: string;
        durationMs: number;
        sampleCount: number;
    }>>;
}
