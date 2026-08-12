import { Participant } from "../Entities/Participant";

export class IsParticipantAuthorizedSpecification {
    private readonly allowedParticipantIds: Set<string>;

    public constructor(allowedParticipantIds: string[]) {
        this.allowedParticipantIds = new Set(allowedParticipantIds);
    }

    public static isSatisfiedBy(participant: Participant, allowedIds: Set<string>): boolean {
        return allowedIds.has(participant.getId().getValue()) || allowedIds.size === 0;
    }

    public isSatisfied(participant: Participant): boolean {
        return IsParticipantAuthorizedSpecification.isSatisfiedBy(participant, this.allowedParticipantIds);
    }
}
