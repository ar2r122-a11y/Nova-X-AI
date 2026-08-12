import type { IVoiceEngine } from "../../Contracts/IVoiceEngine";
import type { IVoiceRecoveryWorker } from "../../Contracts/IVoiceRecoveryWorker";
import type { RuntimeConfiguration } from "../../Contracts/Runtime";
import { BaseVoiceWorker } from "./BaseVoiceWorker";

export class VoiceRecoveryWorker extends BaseVoiceWorker {
    constructor() {
        super(5000);
    }

    async recover(sessionId: string, reason: string): Promise<void> {
        if (!this.engine) {
            throw new Error("VoiceRecoveryWorker not configured with engine.");
        }
        const { VoiceId } = await import("../../Domain/ValueObjects/VoiceId");
        const voiceId = VoiceId.create(sessionId);
        await this.engine.initialize(voiceId.getValue());
    }

    protected tickImpl(): Promise<void> {
        return Promise.resolve();
    }
}
