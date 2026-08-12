/**
 * Nova X AI
 * Conversation Engine
 * Domain Entity: Participant
 */

import { ParticipantId } from "../ValueObjects/ParticipantId";

export class Participant {
    private constructor(
        private readonly id: ParticipantId,
        private readonly participantType: string,
        private readonly displayName: string,
        private readonly priority: number,
        private readonly isActive: boolean,
        private readonly joinedAt: number
    ) {}

    public static create(
        id: ParticipantId,
        participantType: string,
        displayName: string,
        priority: number,
        isActive: boolean,
        joinedAt: number
    ): Participant {
        return new Participant(id, participantType, displayName, priority, isActive, joinedAt);
    }

    public getId(): ParticipantId {
        return this.id;
    }

    public getParticipantType(): string {
        return this.participantType;
    }

    public getDisplayName(): string {
        return this.displayName;
    }

    public getPriority(): number {
        return this.priority;
    }

    public isCurrentlyActive(): boolean {
        return this.isActive;
    }

    public getJoinedAt(): number {
        return this.joinedAt;
    }

    public deactivate(): Participant {
        return new Participant(
            this.id,
            this.participantType,
            this.displayName,
            this.priority,
            false,
            this.joinedAt
        );
    }
}
