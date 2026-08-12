import { AudioChunk } from "../../Domain/ValueObjects/AudioChunk";
import { AudioChunkSequence } from "../../Domain/ValueObjects/AudioChunkSequence";

export class StreamCompletionHandler {
    async complete(streamId: string): Promise<void> {
    }

    async fail(streamId: string, reason: string): Promise<void> {
    }
}
