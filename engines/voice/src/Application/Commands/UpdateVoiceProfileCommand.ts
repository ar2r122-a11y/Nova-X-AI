import { ICommand } from "@nova-x-ai/core";
import { VoiceProfileId } from "../../Domain/ValueObjects/VoiceProfileId";

export class UpdateVoiceProfileCommand implements ICommand {
    constructor(
        public readonly profileId: string,
        public readonly speakingRate?: number,
        public readonly pitchModifier?: number,
        public readonly supportedParameters?: string[],
        public readonly modelMetadata?: Record<string, unknown>,
        public readonly providerCapabilityMetadata?: Record<string, unknown>,
        public readonly correlationId: string = `update-profile-${Date.now()}`,
        public readonly causationId: string = "",
        public readonly claims: { roles: string[]; permissions: string[] } = { roles: [], permissions: [] }
    ) {}
}
