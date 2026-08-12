import type { IStreamManager, IMultiSpeakerCoordinator } from "../../Domain/Services";
import { AudioChunk } from "../../Domain/ValueObjects/AudioChunk";
import { PCMBuffer } from "../../Domain/ValueObjects/PCMBuffer";

export class SpeakerVoiceMapping {
    private readonly mappings: Map<string, string> = new Map();

    map(characterId: string, voiceProfileId: string): void {
        this.mappings.set(characterId, voiceProfileId);
    }

    get(characterId: string): string | undefined {
        return this.mappings.get(characterId);
    }

    remove(characterId: string): void {
        this.mappings.delete(characterId);
    }

    clear(): void {
        this.mappings.clear();
    }
}

export class VoiceQueue {
    private readonly queue: Array<{ stream: IStreamManager; priority: number }> = [];

    enqueue(stream: IStreamManager, priority: number): void {
        this.queue.push({ stream, priority });
        this.queue.sort((a, b) => b.priority - a.priority);
    }

    dequeue(): { stream: IStreamManager; priority: number } | undefined {
        return this.queue.shift();
    }

    size(): number {
        return this.queue.length;
    }

    clear(): void {
        this.queue.length = 0;
    }
}

export class PriorityResolver {
    resolve(queue: VoiceQueue): { stream: IStreamManager; priority: number } | undefined {
        return queue.dequeue();
    }
}

export class SequencingManager {
    private sequence = 0;

    next(): number {
        return this.sequence++;
    }

    reset(): void {
        this.sequence = 0;
    }
}

export class TrackMixer {
    mix(tracks: PCMBuffer[]): PCMBuffer {
        if (tracks.length === 0) {
            return PCMBuffer.empty(
                { getValue: () => 24000 } as any,
                { getValue: () => 16 } as any,
                1
            );
        }
        if (tracks.length === 1) {
            return tracks[0];
        }
        const maxLength = Math.max(...tracks.map(t => t.getData().byteLength));
        const mixed = new Uint8Array(maxLength);
        for (let i = 0; i < maxLength; i++) {
            let sum = 0;
            for (const track of tracks) {
                const data = new Uint8Array(track.getData());
                sum += (data[i] || 0) / tracks.length;
            }
            mixed[i] = Math.min(255, Math.max(0, sum));
        }
        return PCMBuffer.create(mixed.buffer, { getValue: () => 24000 } as any, { getValue: () => 16 } as any, 1);
    }
}

export class ClippingPrevention {
    prevent(buffer: PCMBuffer): PCMBuffer {
        return buffer;
    }
}

export class MultiSpeakerVoiceCoordinator implements IMultiSpeakerCoordinator {
    private readonly voiceMapping = new SpeakerVoiceMapping();
    private readonly voiceQueue = new VoiceQueue();
    private readonly priorityResolver = new PriorityResolver();
    private readonly sequencingManager = new SequencingManager();

    async resolveVoiceProfile(characterId: string): Promise<string | null> {
        return this.voiceMapping.get(characterId) || null;
    }

    async queueAudio(stream: import("../../Contracts/IAudioStreamingWorker").StreamHandle, priority: number): Promise<void> {
        this.voiceQueue.enqueue(stream as any, priority);
    }

    async mix(): Promise<PCMBuffer | null> {
        return null;
    }

    mapVoice(characterId: string, voiceProfileId: string): void {
        this.voiceMapping.map(characterId, voiceProfileId);
    }
}
