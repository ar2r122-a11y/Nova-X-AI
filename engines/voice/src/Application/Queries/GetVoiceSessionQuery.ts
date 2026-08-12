import { IQuery } from "@nova-x-ai/core";
import { VoiceSessionId } from "../../Domain/ValueObjects/VoiceSessionId";

export class GetVoiceSessionQuery implements IQuery {
    constructor(
        public readonly sessionId: string,
        public readonly requesterId?: string
    ) {}
}
