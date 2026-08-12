import { VoiceProfile } from "../Entities/VoiceProfile";
import { VoiceStateRef } from "../ValueObjects/VoiceState";
import { SynthesisQuotaPolicy } from "../Policies/SynthesisQuotaPolicy";

export class ValidVoiceProfileSpecification {
    static isSatisfiedBy(profile: VoiceProfile | null): boolean {
        if (!profile) {
            return false;
        }
        return profile.getConfigurationVersion() > 0 && profile.getVoiceId().length > 0;
    }
}

export class SynthesisQuotaAvailableSpecification {
    static isSatisfiedBy(dailyCount: number, monthlyDurationMs: number, estimatedDurationMs: number): boolean {
        return SynthesisQuotaPolicy.canSynthesize(dailyCount, monthlyDurationMs, estimatedDurationMs);
    }
}

export class ProviderHealthySpecification {
    static isSatisfiedBy(health: "healthy" | "degraded" | "unhealthy"): boolean {
        return health !== "unhealthy";
    }
}

export class ValidStateTransitionSpecification {
    static isSatisfiedBy(current: VoiceStateRef, target: VoiceStateRef): boolean {
        const currentState = current.getValue();
        const targetState = target.getValue();

        const validTransitions: Record<string, string[]> = {
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

        return validTransitions[currentState]?.includes(targetState) ?? false;
    }
}
