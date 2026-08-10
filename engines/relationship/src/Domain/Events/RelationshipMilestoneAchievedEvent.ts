import { IDomainEvent } from "@nova-x-ai/core";

export class RelationshipMilestoneAchievedEvent implements IDomainEvent {
    readonly eventType = "EVT_REL_RelationshipMilestoneAchieved";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly relationshipId: string,
        public readonly milestoneId: string,
        public readonly milestoneName: string,
        public readonly sourceEntityId: string,
        public readonly targetEntityId: string,
        timestamp: number,
        correlationId: string
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
