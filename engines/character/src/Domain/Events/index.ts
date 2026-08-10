
import { IDomainEvent } from "@nova-x-ai/core";
import { CharacterId } from "../ValueObjects";

export class CharacterCreatedEvent implements IDomainEvent {
    readonly eventType = "EVT_CHAR_CharacterCreated";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly characterId: CharacterId,
        public readonly name: string,
        public readonly createdAt: number,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class CharacterStateChangedEvent implements IDomainEvent {
    readonly eventType = "EVT_CHAR_CharacterStateChanged";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly characterId: CharacterId,
        public readonly previousStatus: string,
        public readonly newStatus: string,
        timestamp: number,
        correlationId: string
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}

export class CharacterTraitsUpdatedEvent implements IDomainEvent {
    readonly eventType = "EVT_CHAR_CharacterTraitsUpdated";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly characterId: CharacterId,
        public readonly updatedTraits: string[],
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class CharacterProfileUpdatedEvent implements IDomainEvent {
    readonly eventType = "EVT_CHAR_CharacterProfileUpdated";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly characterId: CharacterId,
        public readonly updatedFields: string[],
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class CharacterRoutineCompletedEvent implements IDomainEvent {
    readonly eventType = "EVT_CHAR_CharacterRoutineCompleted";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly characterId: CharacterId,
        public readonly completedActivity: string,
        timestamp: number,
        correlationId: string
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}

export class CharacterEmotionalStateUpdatedEvent implements IDomainEvent {
    readonly eventType = "EVT_CHAR_CharacterEmotionalStateUpdated";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly characterId: CharacterId,
        public readonly emotion: string,
        public readonly arousalLevel: number,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class CharacterContextAssembledEvent implements IDomainEvent {
    readonly eventType = "EVT_CHAR_CharacterContextAssembled";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly characterId: CharacterId,
        public readonly contextTokenCount: number,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class CharacterEvolutionTriggeredEvent implements IDomainEvent {
    readonly eventType = "EVT_CHAR_CharacterEvolutionTriggered";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly characterId: CharacterId,
        public readonly previousStage: string,
        public readonly newStage: string,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class CharacterBoundaryViolatedEvent implements IDomainEvent {
    readonly eventType = "EVT_CHAR_CharacterBoundaryViolated";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly characterId: CharacterId,
        public readonly boundaryRule: string,
        public readonly requesterId: string,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}
