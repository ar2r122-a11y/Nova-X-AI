import { ICommand } from "@nova-x-ai/core";
import { VoiceProfileId } from "../../Domain/ValueObjects/VoiceProfileId";

export class CreateVoiceProfileCommand implements ICommand {
    constructor(
        public readonly characterId: string,
        public readonly voiceId: string,
        public readonly locale: string,
        public readonly correlationId: string = `create-profile-${Date.now()}`,
        public readonly causationId: string = "",
        public readonly claims: { roles: string[]; permissions: string[] } = { roles: [], permissions: [] }
    ) {}
}
