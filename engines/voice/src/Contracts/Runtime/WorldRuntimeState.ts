export type VoiceRuntimeState = "initialized" | "waiting_for_input" | "synthesizing" | "streaming_audio" | "buffering" | "awaiting_stt" | "processing_transcription" | "completed" | "paused" | "failed" | "recovering";

export function isValidRuntimeTransition(current: VoiceRuntimeState, target: VoiceRuntimeState): boolean {
    const validTransitions: Record<string, string[]> = {
        "initialized": ["waiting_for_input"],
        "waiting_for_input": ["synthesizing", "paused", "recovering"],
        "synthesizing": ["streaming_audio", "failed", "buffering"],
        "streaming_audio": ["completed", "failed", "buffering"],
        "buffering": ["streaming_audio", "failed"],
        "awaiting_stt": ["processing_transcription", "failed"],
        "processing_transcription": ["completed", "failed", "waiting_for_input"],
        "completed": ["waiting_for_input"],
        "paused": ["waiting_for_input"],
        "failed": ["recovering", "waiting_for_input"],
        "recovering": ["waiting_for_input"]
    };

    return validTransitions[current]?.includes(target) ?? false;
}
