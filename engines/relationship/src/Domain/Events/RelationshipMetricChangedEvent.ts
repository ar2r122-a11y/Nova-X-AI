import { IDomainEvent } from "@nova-x-ai/core";

export class RelationshipMetricChangedEvent implements IDomainEvent {
    readonly eventType = "EVT_REL_RelationshipMetricChanged";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly relationshipId: string,
        public readonly sourceEntityId: string,
        public readonly targetEntityId: string,
        public readonly previousTrust: number,
        public readonly newTrust: number,
        public readonly previousAffinity: number,
        public readonly newAffinity: number,
        public readonly previousRespect: number,
        public readonly newRespect: number,
        public readonly previousLoyalty: number,
        public readonly newLoyalty: number,
        public readonly trigger: string,
        timestamp: number,
        correlationId: string
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
