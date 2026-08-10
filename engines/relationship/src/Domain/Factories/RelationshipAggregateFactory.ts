import { RelationshipAggregate } from "../Aggregates/RelationshipAggregate";
import { BondType } from "../ValueObjects/BondType";

export class RelationshipAggregateFactory {
    static create(
        relationshipId: string,
        sourceEntityId: string,
        targetEntityId: string,
        bondType: BondType
    ): RelationshipAggregate {
        return RelationshipAggregate.create(relationshipId, sourceEntityId, targetEntityId, bondType);
    }

    static reconstitute(snapshot: {
        relationshipId: string;
        sourceEntityId: string;
        targetEntityId: string;
        bondType: string;
        relationshipStatus: string;
        establishedTimestamp: number;
        metrics: { trust: number; affinity: number; respect: number; loyalty: number };
        betrayalHistory: { timestamp: number; severity: number; description: string }[];
        friendshipLevel: string;
        romanceStage: string;
        romanticChemistry: number;
        familyType: string;
        bloodRelation: boolean;
        professionalRole: string;
        reputationIndex: number;
        socialGraphAdjacency: string[];
        interactionLedger: { entryId: string; timestamp: number; sourceEntityId: string; targetEntityId: string; interactionType: string; emotionalValence: number; trustDelta: number; affinityDelta: number; respectDelta: number; loyaltyDelta: number; contextTags: string[]; sharedMemoryIds: string[] }[];
        relationshipHistory: { entryId: string; timestamp: number; previousMetrics: { trust: number; affinity: number; respect: number; loyalty: number }; newMetrics: { trust: number; affinity: number; respect: number; loyalty: number }; previousStatus: string; newStatus: string; trigger: string; sourceEntityId: string }[];
        unlockedMilestones: { milestoneId: string; name: string; description: string; requiredTrust: number; requiredAffinity: number; requiredRespect: number; requiredLoyalty: number; requiredBondType: string; unlockedAt?: number }[];
        sharedExperienceTags: string[];
        sharedMemoryIds: string[];
        emotionalResonance: number;
        relationshipContext: Record<string, unknown>;
        relationshipStatistics: { totalInteractions: number; positiveInteractions: number; negativeInteractions: number; lastInteractionTimestamp: number; daysSinceLastInteraction: number };
        relationshipPermissions: { accessLevel: string; boundaryConstraints: string[] };
        relationshipRules: string[];
        growthTrajectory: number;
        neglectDecayRate: number;
        repairState: { attempts: number; lastAttemptTimestamp: number; recoveryProgress: number };
    }): RelationshipAggregate {
        return RelationshipAggregate.reconstitute(snapshot);
    }
}
