import { ICommand } from "@nova-x-ai/core";
import { VoiceProfileId } from "../../Domain/ValueObjects/VoiceProfileId";

export class SynthesizeSpeechCommand implements ICommand {
    constructor(
        public readonly voiceId: string,
        public readonly text: string,
        public readonly voiceProfileId: string,
        public readonly providerId?: string,
        public readonly correlationId: string = `synth-${Date.now()}`,
        public readonly causationId: string = "",
        public readonly claims: { roles: string[]; permissions: string[] } = { roles: [], permissions: [] }
    ) {}
}
