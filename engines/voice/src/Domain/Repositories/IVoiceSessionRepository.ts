import { VoiceSessionAggregate } from "../../Domain/Aggregates/VoiceSessionAggregate";
import { VoiceSessionId } from "../../Domain/ValueObjects/VoiceSessionId";

export interface IVoiceSessionRepository {
    findById(sessionId: VoiceSessionId): Promise<VoiceSessionAggregate | null>;
    findByVoiceId(voiceId: string): Promise<VoiceSessionAggregate[]>;
    save(aggregate: VoiceSessionAggregate): Promise<void>;
}
