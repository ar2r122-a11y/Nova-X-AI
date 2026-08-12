export type VoiceSessionState = "idle" | "active" | "interrupted" | "completed" | "failed";

export class VoiceSessionStateRef {
    private readonly value: VoiceSessionState;

    private constructor(value: VoiceSessionState) {
        this.value = value;
    }

    static create(value: VoiceSessionState): VoiceSessionStateRef {
        const valid: VoiceSessionState[] = ["idle", "active", "interrupted", "completed", "failed"];
        if (!valid.includes(value)) {
            throw new Error(`Invalid VoiceSessionState: ${value}`);
        }
        return new VoiceSessionStateRef(value);
    }

    static idle(): VoiceSessionStateRef {
        return VoiceSessionStateRef.create("idle");
    }

    static active(): VoiceSessionStateRef {
        return VoiceSessionStateRef.create("active");
    }

    static interrupted(): VoiceSessionStateRef {
        return VoiceSessionStateRef.create("interrupted");
    }

    static completed(): VoiceSessionStateRef {
        return VoiceSessionStateRef.create("completed");
    }

    static failed(): VoiceSessionStateRef {
        return VoiceSessionStateRef.create("failed");
    }

    getValue(): VoiceSessionState {
        return this.value;
    }

    equals(other: VoiceSessionStateRef): boolean {
        return this.value === other.value;
    }
}
