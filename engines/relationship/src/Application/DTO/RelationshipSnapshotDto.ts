import { BondType } from "../../Domain/ValueObjects/BondType";
import { FriendshipLevel } from "../../Domain/ValueObjects/FriendshipLevel";
import { RomanceStage } from "../../Domain/ValueObjects/RomanceStage";
import { MilestoneDescriptor } from "../../Domain/ValueObjects/MilestoneDescriptor";

export class RelationshipSnapshotDto {
    constructor(
        public readonly relationshipId: string,
        public readonly sourceEntityId: string,
        public readonly targetEntityId: string,
        public readonly bondType: BondType,
        public readonly relationshipStatus: string,
        public readonly establishedTimestamp: number,
        public readonly trust: number,
        public readonly affinity: number,
        public readonly respect: number,
        public readonly loyalty: number,
        public readonly friendshipLevel: FriendshipLevel,
        public readonly romanceStage: RomanceStage,
        public readonly familyType: string,
        public readonly professionalRole: string,
        public readonly reputationIndex: number,
        public readonly sharedMemoryIds: string[],
        public readonly unlockedMilestones: MilestoneDescriptor[],
        public readonly lastUpdated: number
    ) {}

    static fromAggregate(aggregate: import("../../Domain/Aggregates/RelationshipAggregate").RelationshipAggregate): RelationshipSnapshotDto {
        const metrics = aggregate.getMetrics();
        const snap = aggregate.getSnapshot() as any;
        return new RelationshipSnapshotDto(
            aggregate.getRelationshipId(),
            aggregate.getSourceEntityId(),
            aggregate.getTargetEntityId(),
            aggregate.getBondType(),
            aggregate.getRelationshipStatus(),
            snap.establishedTimestamp,
            metrics.trust,
            metrics.affinity,
            metrics.respect,
            metrics.loyalty,
            snap.friendshipLevel,
            snap.romanceStage,
            snap.familyType,
            snap.professionalRole,
            aggregate.getReputationIndex(),
            aggregate.getSharedMemoryIds(),
            aggregate.getUnlockedMilestones(),
            Date.now()
        );
    }
}
