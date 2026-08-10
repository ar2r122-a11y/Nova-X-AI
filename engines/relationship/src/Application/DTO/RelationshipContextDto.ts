import { BondType } from "../../Domain/ValueObjects/BondType";

export class RelationshipContextDto {
    constructor(
        public readonly relationshipId: string,
        public readonly sourceEntityId: string,
        public readonly targetEntityId: string,
        public readonly bondType: BondType,
        public readonly status: string,
        public readonly trust: number,
        public readonly affinity: number,
        public readonly respect: number,
        public readonly loyalty: number,
        public readonly friendshipLevel: string,
        public readonly romanceStage: string,
        public readonly promptContext: string,
        public readonly sharedMemoryIds: string[],
        public readonly recentMilestones: { name: string; unlockedAt?: number }[]
    ) {}

    static fromAggregate(aggregate: import("../../Domain/Aggregates/RelationshipAggregate").RelationshipAggregate): RelationshipContextDto {
        const metrics = aggregate.getMetrics();
        const snap = aggregate.getSnapshot() as any;
        const recentMilestones = (snap.unlockedMilestones ?? []).slice(-5).map((m: { name: string; unlockedAt?: number }) => ({
            name: m.name,
            unlockedAt: m.unlockedAt
        }));

        const contextParts: string[] = [];
        contextParts.push(`Relationship: ${snap.bondType} (${snap.relationshipStatus})`);
        contextParts.push(`Trust: ${metrics.trust.toFixed(2)}, Affinity: ${metrics.affinity.toFixed(2)}`);
        contextParts.push(`Respect: ${metrics.respect.toFixed(2)}, Loyalty: ${metrics.loyalty.toFixed(2)}`);
        contextParts.push(`Friendship: ${snap.friendshipLevel}, Romance: ${snap.romanceStage}`);
        if (recentMilestones.length > 0) {
            contextParts.push(`Recent Milestones:`);
            recentMilestones.forEach((m: { name: string; unlockedAt?: number }) => {
                contextParts.push(`  ${m.name}`);
            });
        }

        return new RelationshipContextDto(
            aggregate.getRelationshipId(),
            aggregate.getSourceEntityId(),
            aggregate.getTargetEntityId(),
            aggregate.getBondType(),
            aggregate.getRelationshipStatus(),
            metrics.trust,
            metrics.affinity,
            metrics.respect,
            metrics.loyalty,
            snap.friendshipLevel,
            snap.romanceStage,
            contextParts.join("\n"),
            aggregate.getSharedMemoryIds(),
            recentMilestones
        );
    }
}
