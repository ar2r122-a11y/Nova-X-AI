import { AudioDuration } from "../../Domain/ValueObjects/AudioDuration";

export class VoiceBudgetAllocator {
    private readonly hardLatencyMs: number;
    private readonly softLatencyMs: number;
    private readonly audioRingBufferBytes: number;
    private readonly networkBitrateKbps: number;
    private readonly maxInputCharacters: number;
    private readonly chunkSizeBytes: number;

    private usedLatencyMs = 0;
    private usedRingBufferBytes = 0;
    private usedBitrateKbps = 0;

    constructor(
        hardLatencyMs: number = 200,
        softLatencyMs: number = 150,
        audioRingBufferBytes: number = 64 * 1024 * 1024,
        networkBitrateKbps: number = 128,
        maxInputCharacters: number = 2048,
        chunkSizeBytes: number = 4096
    ) {
        this.hardLatencyMs = hardLatencyMs;
        this.softLatencyMs = softLatencyMs;
        this.audioRingBufferBytes = audioRingBufferBytes;
        this.networkBitrateKbps = networkBitrateKbps;
        this.maxInputCharacters = maxInputCharacters;
        this.chunkSizeBytes = chunkSizeBytes;
    }

    allocateLatency(ms: number): boolean {
        if (this.usedLatencyMs + ms > this.hardLatencyMs) {
            return false;
        }
        this.usedLatencyMs += ms;
        return true;
    }

    allocateBuffer(bytes: number): boolean {
        if (this.usedRingBufferBytes + bytes > this.audioRingBufferBytes) {
            return false;
        }
        this.usedRingBufferBytes += bytes;
        return true;
    }

    allocateBitrate(kbps: number): boolean {
        if (this.usedBitrateKbps + kbps > this.networkBitrateKbps) {
            return false;
        }
        this.usedBitrateKbps += kbps;
        return true;
    }

    releaseLatency(ms: number): void {
        this.usedLatencyMs = Math.max(0, this.usedLatencyMs - ms);
    }

    releaseBuffer(bytes: number): void {
        this.usedRingBufferBytes = Math.max(0, this.usedRingBufferBytes - bytes);
    }

    releaseBitrate(kbps: number): void {
        this.usedBitrateKbps = Math.max(0, this.usedBitrateKbps - kbps);
    }

    getUsedLatencyMs(): number {
        return this.usedLatencyMs;
    }

    getUsedRingBufferBytes(): number {
        return this.usedRingBufferBytes;
    }

    getUsedBitrateKbps(): number {
        return this.usedBitrateKbps;
    }

    getHardLatencyMs(): number {
        return this.hardLatencyMs;
    }

    getSoftLatencyMs(): number {
        return this.softLatencyMs;
    }

    getAudioRingBufferBytes(): number {
        return this.audioRingBufferBytes;
    }

    getNetworkBitrateKbps(): number {
        return this.networkBitrateKbps;
    }

    getMaxInputCharacters(): number {
        return this.maxInputCharacters;
    }

    getChunkSizeBytes(): number {
        return this.chunkSizeBytes;
    }

    isLatencyExceeded(): boolean {
        return this.usedLatencyMs > this.hardLatencyMs;
    }

    isBufferExceeded(): boolean {
        return this.usedRingBufferBytes > this.audioRingBufferBytes;
    }

    isBitrateExceeded(): boolean {
        return this.usedBitrateKbps > this.networkBitrateKbps;
    }
}
