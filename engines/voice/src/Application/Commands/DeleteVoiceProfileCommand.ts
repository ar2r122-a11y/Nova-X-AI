import { ICommand } from "@nova-x-ai/core";
import { VoiceProfileId } from "../../Domain/ValueObjects/VoiceProfileId";

export class DeleteVoiceProfileCommand implements ICommand {
    constructor(
        public readonly profileId: string,
        public readonly correlationId: string = `delete-profile-${Date.now()}`,
        public readonly causationId: string = "",
        public readonly claims: { roles: string[]; permissions: string[] } = { roles: [], permissions: [] }
    ) {}
}
