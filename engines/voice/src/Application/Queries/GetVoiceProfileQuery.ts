import { IQuery } from "@nova-x-ai/core";
import { VoiceProfileId } from "../../Domain/ValueObjects/VoiceProfileId";

export class GetVoiceProfileQuery implements IQuery {
    constructor(
        public readonly profileId: string,
        public readonly requesterId?: string
    ) {}
}
