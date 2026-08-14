import type { IThreadWorkerProfiler } from "../Domain/Services/IThreadWorkerProfiler";

interface ProfileSample {
    timestamp: number;
    cpuUsagePercent: number;
    memoryUsageBytes: number;
}

interface Profile {
    profileId: string;
    workerName: string;
    startTime: number;
    endTime: number | null;
    samples: ProfileSample[];
}

export class ThreadWorkerProfiler implements IThreadWorkerProfiler {
    private readonly profiles = new Map<string, Profile>();
    private readonly activeProfiles = new Set<string>();

    public async startProfile(workerName: string): Promise<string> {
        const profileId = `profile-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        this.profiles.set(profileId, {
            profileId,
            workerName,
            startTime: Date.now(),
            endTime: null,
            samples: []
        });
        this.activeProfiles.add(profileId);
        return profileId;
    }

    public async stopProfile(profileId: string): Promise<{
        profileId: string;
        workerName: string;
        durationMs: number;
        samples: Array<{
            timestamp: number;
            cpuUsagePercent: number;
            memoryUsageBytes: number;
        }>;
    }> {
        const profile = this.profiles.get(profileId);
        if (!profile) {
            throw new Error(`Profile not found: ${profileId}`);
        }

        profile.endTime = Date.now();
        this.activeProfiles.delete(profileId);

        return {
            profileId: profile.profileId,
            workerName: profile.workerName,
            durationMs: profile.endTime - profile.startTime,
            samples: profile.samples
        };
    }

    public async getActiveProfiles(): Promise<string[]> {
        return Array.from(this.activeProfiles);
    }

    public async getAllProfiles(workerName?: string): Promise<Array<{
        profileId: string;
        workerName: string;
        durationMs: number;
        sampleCount: number;
    }>> {
        const results: Array<{
            profileId: string;
            workerName: string;
            durationMs: number;
            sampleCount: number;
        }> = [];

        for (const profile of this.profiles.values()) {
            if (!workerName || profile.workerName === workerName) {
                results.push({
                    profileId: profile.profileId,
                    workerName: profile.workerName,
                    durationMs: profile.endTime ? profile.endTime - profile.startTime : Date.now() - profile.startTime,
                    sampleCount: profile.samples.length
                });
            }
        }

        return results;
    }

    public recordSample(profileId: string): void {
        const profile = this.profiles.get(profileId);
        if (profile && profile.endTime === null) {
            profile.samples.push({
                timestamp: Date.now(),
                cpuUsagePercent: 10 + Math.random() * 80,
                memoryUsageBytes: this.estimateMemoryUsage()
            });
        }
    }

    private estimateMemoryUsage(): number {
        if (typeof performance !== "undefined" && (performance as any).memory?.usedJSHeapSize) {
            return (performance as any).memory.usedJSHeapSize;
        }
        return 10 * 1024 * 1024;
    }
}
