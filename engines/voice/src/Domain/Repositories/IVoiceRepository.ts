import { VoiceAggregate } from "../../Domain/Aggregates/VoiceAggregate";
import { VoiceId } from "../../Domain/ValueObjects/VoiceId";

export interface IVoiceRepository {
    findById(voiceId: VoiceId): Promise<VoiceAggregate | null>;
    save(aggregate: VoiceAggregate): Promise<void>;
}
