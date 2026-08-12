import type { IVoiceEngine } from "../../Contracts/IVoiceEngine";
import type { IAudioStreamingWorker, StreamRequest, StreamHandle } from "../../Contracts/IAudioStreamingWorker";
import type { RuntimeConfiguration } from "../../Contracts/Runtime";
import { BaseVoiceWorker } from "./BaseVoiceWorker";
import { AudioStreamHandleDto } from "../../Application/DTO/AudioStreamHandleDto";
import { AudioChunk } from "../../Domain/ValueObjects/AudioChunk";
import { AudioChunkSequence } from "../../Domain/ValueObjects/AudioChunkSequence";
import { AudioCodec } from "../../Domain/ValueObjects/AudioCodec";
import { PCMBuffer } from "../../Domain/ValueObjects/PCMBuffer";
import { StreamingPolicy } from "../../Domain/Policies/StreamingPolicy";

export class AudioStreamingWorker extends BaseVoiceWorker {
    private readonly activeStreams: Map<string, AsyncIterable<AudioChunk>> = new Map();

    constructor() {
        super(1000);
    }

    async enqueueStream(request: StreamRequest): Promise<StreamHandle> {
        const streamId = request.streamId;
        const generator = this.generateAudioChunks(request);
        this.activeStreams.set(streamId, generator);
        return { streamId, audioChunkIterator: generator };
    }

    async cancelStream(streamId: string): Promise<void> {
        const generator = this.activeStreams.get(streamId) as AsyncGenerator<AudioChunk, void, unknown> | undefined;
        if (generator) {
            await generator.return(undefined);
            this.activeStreams.delete(streamId);
        }
    }

    private async *generateAudioChunks(request: { text: string; voiceProfileId: string; providerId: string; correlationId: string }): AsyncIterable<AudioChunk> {
        const chunkSize = StreamingPolicy.getChunkSize();
        const text = request.text || "Synthesized audio stream.";
        const totalChunks = Math.max(1, Math.ceil(text.length / 10));

        for (let i = 0; i < totalChunks; i++) {
            if (!this.running) {
                break;
            }
            const sequence = AudioChunkSequence.create(i);
            const data = new ArrayBuffer(chunkSize);
            const view = new Uint8Array(data);
            for (let j = 0; j < view.length; j++) {
                view[j] = (i * 256 + j) % 256;
            }
            const isLast = i === totalChunks - 1;
            yield AudioChunk.create(sequence, data, Date.now(), isLast, AudioCodec.pcm());
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    protected tickImpl(): Promise<void> {
        return Promise.resolve();
    }
}
