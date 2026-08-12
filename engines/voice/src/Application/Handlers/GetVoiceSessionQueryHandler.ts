import { IQueryHandler } from "@nova-x-ai/core";
import type { IVoiceSessionRepository } from "../../Domain/Repositories/IVoiceSessionRepository";
import { GetVoiceSessionQuery } from "../Queries/GetVoiceSessionQuery";
import { VoiceSessionDto } from "../DTO/VoiceSessionDto";

export class GetVoiceSessionQueryHandler implements IQueryHandler<GetVoiceSessionQuery, VoiceSessionDto> {
    constructor(private readonly sessionRepository: IVoiceSessionRepository) {}

    async handle(query: GetVoiceSessionQuery): Promise<VoiceSessionDto> {
        const { VoiceSessionId } = await import("../../Domain/ValueObjects/VoiceSessionId");
        const sessionId = VoiceSessionId.create(query.sessionId);
        const session = await this.sessionRepository.findById(sessionId);
        if (!session) {
            throw new Error(`Voice session not found: ${query.sessionId}`);
        }
        return VoiceSessionDto.fromAggregate(session as any);
    }
}
