export type VoiceState = "waiting_for_input" | "synthesizing" | "streaming_audio" | "buffering" | "awaiting_stt" | "processing_transcription" | "completed" | "paused" | "failed" | "recovering";

export class VoiceStateRef {
    private readonly value: VoiceState;

    private constructor(value: VoiceState) {
        this.value = value;
    }

    static create(value: VoiceState): VoiceStateRef {
        const valid: VoiceState[] = ["waiting_for_input", "synthesizing", "streaming_audio", "buffering", "awaiting_stt", "processing_transcription", "completed", "paused", "failed", "recovering"];
        if (!valid.includes(value)) {
            throw new Error(`Invalid VoiceState: ${value}`);
        }
        return new VoiceStateRef(value);
    }

    static waitingForInput(): VoiceStateRef {
        return VoiceStateRef.create("waiting_for_input");
    }

    static synthesizing(): VoiceStateRef {
        return VoiceStateRef.create("synthesizing");
    }

    static streamingAudio(): VoiceStateRef {
        return VoiceStateRef.create("streaming_audio");
    }

    static buffering(): VoiceStateRef {
        return VoiceStateRef.create("buffering");
    }

    static awaitingStt(): VoiceStateRef {
        return VoiceStateRef.create("awaiting_stt");
    }

    static processingTranscription(): VoiceStateRef {
        return VoiceStateRef.create("processing_transcription");
    }

    static completed(): VoiceStateRef {
        return VoiceStateRef.create("completed");
    }

    static paused(): VoiceStateRef {
        return VoiceStateRef.create("paused");
    }

    static failed(): VoiceStateRef {
        return VoiceStateRef.create("failed");
    }

    static recovering(): VoiceStateRef {
        return VoiceStateRef.create("recovering");
    }

    getValue(): VoiceState {
        return this.value;
    }

    equals(other: VoiceStateRef): boolean {
        return this.value === other.value;
    }
}
