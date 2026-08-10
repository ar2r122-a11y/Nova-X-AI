import { IDomainEvent } from "@nova-x-ai/core";
import { RelationshipMetrics } from "../ValueObjects/RelationshipMetrics";
import { BondType } from "../ValueObjects/BondType";
import { FriendshipLevel } from "../ValueObjects/FriendshipLevel";
import { RomanceStage } from "../ValueObjects/RomanceStage";
import { FamilyType } from "../ValueObjects/FamilyType";
import { ProfessionalRole } from "../ValueObjects/ProfessionalRole";
import { MilestoneDescriptor } from "../ValueObjects/MilestoneDescriptor";
import { InteractionLedgerEntry } from "../Entities/InteractionLedgerEntry";
import { RelationshipHistoryEntry } from "../Entities/RelationshipHistoryEntry";
import {
    RelationshipEstablishedEvent,
    RelationshipMetricChangedEvent,
    RelationshipMilestoneAchievedEvent,
    RelationshipSeveredEvent
} from "../Events";

export type RelationshipLifecycleState = "establishing" | "active" | "strained" | "dormant" | "severed";

export class RelationshipAggregate {
    private readonly relationshipId: string;
    private readonly sourceEntityId: string;
    private readonly targetEntityId: string;
    private bondType: BondType;
    private relationshipStatus: RelationshipLifecycleState;
    private readonly establishedTimestamp: number;
    private metrics: RelationshipMetrics;
    private readonly betrayalHistory: { timestamp: number; severity: number; description: string }[];
    private friendshipLevel: FriendshipLevel;
    private romanceStage: RomanceStage;
    private romanticChemistry: number;
    private familyType: FamilyType;
    private bloodRelation: boolean;
    private professionalRole: ProfessionalRole;
    private reputationIndex: number;
    private readonly socialGraphAdjacency: string[];
    private readonly interactionLedger: InteractionLedgerEntry[];
    private readonly relationshipHistory: RelationshipHistoryEntry[];
    private readonly unlockedMilestones: MilestoneDescriptor[];
    private readonly sharedExperienceTags: string[];
    private readonly sharedMemoryIds: string[];
    private emotionalResonance: number;
    private relationshipContext: Record<string, unknown>;
    private relationshipStatistics: {
        totalInteractions: number;
        positiveInteractions: number;
        negativeInteractions: number;
        lastInteractionTimestamp: number;
        daysSinceLastInteraction: number;
    };
    private readonly relationshipPermissions: {
        accessLevel: string;
        boundaryConstraints: string[];
    };
    private readonly relationshipRules: string[];
    private growthTrajectory: number;
    private neglectDecayRate: number;
    private repairState: {
        attempts: number;
        lastAttemptTimestamp: number;
        recoveryProgress: number;
    };
    private readonly uncommittedEvents: IDomainEvent[];

    private constructor(props: {
        relationshipId: string;
        sourceEntityId: string;
        targetEntityId: string;
        bondType: BondType;
        relationshipStatus: RelationshipLifecycleState;
        establishedTimestamp: number;
        metrics: RelationshipMetrics;
        betrayalHistory: { timestamp: number; severity: number; description: string }[];
        friendshipLevel: FriendshipLevel;
        romanceStage: RomanceStage;
        romanticChemistry: number;
        familyType: FamilyType;
        bloodRelation: boolean;
        professionalRole: ProfessionalRole;
        reputationIndex: number;
        socialGraphAdjacency: string[];
        interactionLedger: InteractionLedgerEntry[];
        relationshipHistory: RelationshipHistoryEntry[];
        unlockedMilestones: MilestoneDescriptor[];
        sharedExperienceTags: string[];
        sharedMemoryIds: string[];
        emotionalResonance: number;
        relationshipContext: Record<string, unknown>;
        relationshipStatistics: {
            totalInteractions: number;
            positiveInteractions: number;
            negativeInteractions: number;
            lastInteractionTimestamp: number;
            daysSinceLastInteraction: number;
        };
        relationshipPermissions: {
            accessLevel: string;
            boundaryConstraints: string[];
        };
        relationshipRules: string[];
        growthTrajectory: number;
        neglectDecayRate: number;
        repairState: {
            attempts: number;
            lastAttemptTimestamp: number;
            recoveryProgress: number;
        };
    }) {
        this.relationshipId = props.relationshipId;
        this.sourceEntityId = props.sourceEntityId;
        this.targetEntityId = props.targetEntityId;
        this.bondType = props.bondType;
        this.relationshipStatus = props.relationshipStatus;
        this.establishedTimestamp = props.establishedTimestamp;
        this.metrics = props.metrics;
        this.betrayalHistory = props.betrayalHistory;
        this.friendshipLevel = props.friendshipLevel;
        this.romanceStage = props.romanceStage;
        this.romanticChemistry = props.romanticChemistry;
        this.familyType = props.familyType;
        this.bloodRelation = props.bloodRelation;
        this.professionalRole = props.professionalRole;
        this.reputationIndex = props.reputationIndex;
        this.socialGraphAdjacency = props.socialGraphAdjacency;
        this.interactionLedger = props.interactionLedger;
        this.relationshipHistory = props.relationshipHistory;
        this.unlockedMilestones = props.unlockedMilestones;
        this.sharedExperienceTags = props.sharedExperienceTags;
        this.sharedMemoryIds = props.sharedMemoryIds;
        this.emotionalResonance = props.emotionalResonance;
        this.relationshipContext = props.relationshipContext;
        this.relationshipStatistics = props.relationshipStatistics;
        this.relationshipPermissions = props.relationshipPermissions;
        this.relationshipRules = props.relationshipRules;
        this.growthTrajectory = props.growthTrajectory;
        this.neglectDecayRate = props.neglectDecayRate;
        this.repairState = props.repairState;
        this.uncommittedEvents = [];
    }

    static create(
        relationshipId: string,
        sourceEntityId: string,
        targetEntityId: string,
        bondType: BondType
    ): RelationshipAggregate {
        const now = Date.now();
        return new RelationshipAggregate({
            relationshipId,
            sourceEntityId,
            targetEntityId,
            bondType,
            relationshipStatus: "establishing",
            establishedTimestamp: now,
            metrics: RelationshipMetrics.baseline(),
            betrayalHistory: [],
            friendshipLevel: FriendshipLevel.Acquaintance,
            romanceStage: RomanceStage.None,
            romanticChemistry: 0.0,
            familyType: FamilyType.Extended,
            bloodRelation: false,
            professionalRole: ProfessionalRole.Colleague,
            reputationIndex: 0.5,
            socialGraphAdjacency: [],
            interactionLedger: [],
            relationshipHistory: [],
            unlockedMilestones: [],
            sharedExperienceTags: [],
            sharedMemoryIds: [],
            emotionalResonance: 0.0,
            relationshipContext: {},
            relationshipStatistics: {
                totalInteractions: 0,
                positiveInteractions: 0,
                negativeInteractions: 0,
                lastInteractionTimestamp: now,
                daysSinceLastInteraction: 0
            },
            relationshipPermissions: {
                accessLevel: "private",
                boundaryConstraints: []
            },
            relationshipRules: [],
            growthTrajectory: 0.0,
            neglectDecayRate: 0.01,
            repairState: {
                attempts: 0,
                lastAttemptTimestamp: 0,
                recoveryProgress: 0.0
            }
        });
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
        return new RelationshipAggregate({
            relationshipId: snapshot.relationshipId,
            sourceEntityId: snapshot.sourceEntityId,
            targetEntityId: snapshot.targetEntityId,
            bondType: BondType[snapshot.bondType as keyof typeof BondType] ?? BondType.Friendship,
            relationshipStatus: snapshot.relationshipStatus as RelationshipLifecycleState,
            establishedTimestamp: snapshot.establishedTimestamp,
            metrics: RelationshipMetrics.create(
                snapshot.metrics.trust,
                snapshot.metrics.affinity,
                snapshot.metrics.respect,
                snapshot.metrics.loyalty
            ),
            betrayalHistory: snapshot.betrayalHistory,
            friendshipLevel: FriendshipLevel.Acquaintance,
            romanceStage: RomanceStage.None,
            romanticChemistry: 0.0,
            familyType: FamilyType.Extended,
            bloodRelation: false,
            professionalRole: ProfessionalRole.Colleague,
            reputationIndex: snapshot.reputationIndex,
            socialGraphAdjacency: snapshot.socialGraphAdjacency,
            interactionLedger: snapshot.interactionLedger.map(entry => InteractionLedgerEntry.create(
                entry.sourceEntityId,
                entry.targetEntityId,
                entry.interactionType,
                entry.emotionalValence,
                entry.trustDelta,
                entry.affinityDelta,
                entry.respectDelta,
                entry.loyaltyDelta,
                entry.contextTags,
                entry.sharedMemoryIds
            )),
            relationshipHistory: snapshot.relationshipHistory.map(h => RelationshipHistoryEntry.create(
                h.previousMetrics,
                h.newMetrics,
                h.previousStatus,
                h.newStatus,
                h.trigger,
                h.sourceEntityId
            )),
            unlockedMilestones: snapshot.unlockedMilestones.map(m => MilestoneDescriptor.create(
                m.milestoneId,
                m.name,
                m.description,
                m.requiredTrust,
                m.requiredAffinity,
                m.requiredRespect,
                m.requiredLoyalty,
                m.requiredBondType
            )),
            sharedExperienceTags: snapshot.sharedExperienceTags,
            sharedMemoryIds: snapshot.sharedMemoryIds,
            emotionalResonance: snapshot.emotionalResonance,
            relationshipContext: snapshot.relationshipContext,
            relationshipStatistics: snapshot.relationshipStatistics,
            relationshipPermissions: snapshot.relationshipPermissions,
            relationshipRules: snapshot.relationshipRules,
            growthTrajectory: snapshot.growthTrajectory,
            neglectDecayRate: snapshot.neglectDecayRate,
            repairState: snapshot.repairState
        });
    }

    processInteraction(interaction: {
        sourceEntityId: string;
        targetEntityId: string;
        interactionType: string;
        emotionalValence: number;
        contextTags: string[];
        sharedMemoryIds: string[];
        trustDelta: number;
        affinityDelta: number;
        respectDelta: number;
        loyaltyDelta: number;
    }): void {
        const previousMetrics = this.metrics.toJSON();
        const previousStatus = this.relationshipStatus;

        const ledgerEntry = InteractionLedgerEntry.create(
            interaction.sourceEntityId,
            interaction.targetEntityId,
            interaction.interactionType,
            interaction.emotionalValence,
            interaction.trustDelta,
            interaction.affinityDelta,
            interaction.respectDelta,
            interaction.loyaltyDelta,
            interaction.contextTags,
            interaction.sharedMemoryIds
        );

        this.interactionLedger.push(ledgerEntry);
        this.relationshipStatistics.totalInteractions += 1;
        this.relationshipStatistics.lastInteractionTimestamp = Date.now();
        this.relationshipStatistics.daysSinceLastInteraction = 0;

        if (interaction.emotionalValence > 0) {
            this.relationshipStatistics.positiveInteractions += 1;
        } else if (interaction.emotionalValence < 0) {
            this.relationshipStatistics.negativeInteractions += 1;
        }

        this.metrics = RelationshipMetrics.create(
            this.metrics.trust + interaction.trustDelta,
            this.metrics.affinity + interaction.affinityDelta,
            this.metrics.respect + interaction.respectDelta,
            this.metrics.loyalty + interaction.loyaltyDelta
        );

        this.sharedExperienceTags.push(...interaction.contextTags.filter(tag => !this.sharedExperienceTags.includes(tag)));
        this.sharedMemoryIds.push(...interaction.sharedMemoryIds.filter(id => !this.sharedMemoryIds.includes(id)));

        this.evaluateStateTransition();
        this.evaluateMilestoneUnlock();

        this.uncommittedEvents.push(new RelationshipMetricChangedEvent(
            this.relationshipId,
            this.sourceEntityId,
            this.targetEntityId,
            previousMetrics.trust,
            this.metrics.trust,
            previousMetrics.affinity,
            this.metrics.affinity,
            previousMetrics.respect,
            this.metrics.respect,
            previousMetrics.loyalty,
            this.metrics.loyalty,
            interaction.interactionType,
            Date.now(),
            ""
        ));

        this.recordHistoryEntry(previousMetrics, previousStatus, interaction.interactionType);
    }

    executeDecayTick(elapsedMs: number): void {
        if (this.relationshipStatus === "severed") {
            return;
        }

        const previousMetrics = this.metrics.toJSON();
        const previousStatus = this.relationshipStatus;

        const decayFactor = this.neglectDecayRate * (elapsedMs / 86400000);
        this.relationshipStatistics.daysSinceLastInteraction += elapsedMs / 86400000;

        if (this.relationshipStatistics.daysSinceLastInteraction > 7) {
            this.metrics = RelationshipMetrics.create(
                this.metrics.trust * (1 - decayFactor),
                this.metrics.affinity * (1 - decayFactor),
                this.metrics.respect * (1 - decayFactor),
                this.metrics.loyalty * (1 - decayFactor)
            );
        }

        this.evaluateStateTransition();

        if (this.relationshipStatus !== previousStatus ||
            JSON.stringify(previousMetrics) !== JSON.stringify(this.metrics.toJSON())) {
            this.recordHistoryEntry(previousMetrics, previousStatus, "decay");
        }
    }

    recordBetrayal(severity: number, description: string): void {
        this.betrayalHistory.push({
            timestamp: Date.now(),
            severity,
            description
        });

        this.metrics = RelationshipMetrics.create(
            this.metrics.trust * (1 - severity),
            this.metrics.affinity * (1 - severity),
            this.metrics.respect * (1 - severity * 0.5),
            this.metrics.loyalty * (1 - severity)
        );

        if (this.relationshipStatus === "active") {
            this.relationshipStatus = "strained";
        }

        this.evaluateStateTransition();
    }

    initiateRepair(): boolean {
        if (this.relationshipStatus === "severed") {
            return false;
        }

        this.repairState.attempts += 1;
        this.repairState.lastAttemptTimestamp = Date.now();

        if (this.metrics.trust >= 0.3 && this.metrics.respect >= 0.3) {
            this.repairState.recoveryProgress = Math.min(1.0, this.repairState.recoveryProgress + 0.2);
            if (this.relationshipStatus === "strained") {
                this.relationshipStatus = "active";
            }
            return true;
        }

        return false;
    }

    unlockMilestone(milestone: MilestoneDescriptor): void {
        if (this.unlockedMilestones.length >= 100) {
            return;
        }

        const unlocked = milestone.unlock(Date.now());
        this.unlockedMilestones.push(unlocked);

        this.uncommittedEvents.push(new RelationshipMilestoneAchievedEvent(
            this.relationshipId,
            milestone.milestoneId,
            milestone.name,
            this.sourceEntityId,
            this.targetEntityId,
            Date.now(),
            ""
        ));
    }

    recordEstablishment(): void {
        this.uncommittedEvents.push(new RelationshipEstablishedEvent(
            this.relationshipId,
            this.sourceEntityId,
            this.targetEntityId,
            this.bondType,
            Date.now(),
            ""
        ));
    }

    getUncommittedEvents(): readonly IDomainEvent[] {
        return this.uncommittedEvents;
    }

    commitEvents(): void {
        this.uncommittedEvents.length = 0;
    }

    getSnapshot(): object {
        return {
            relationshipId: this.relationshipId,
            sourceEntityId: this.sourceEntityId,
            targetEntityId: this.targetEntityId,
            bondType: this.bondType,
            relationshipStatus: this.relationshipStatus,
            establishedTimestamp: this.establishedTimestamp,
            metrics: this.metrics.toJSON(),
            betrayalHistory: this.betrayalHistory,
            friendshipLevel: this.friendshipLevel,
            romanceStage: this.romanceStage,
            romanticChemistry: this.romanticChemistry,
            familyType: this.familyType,
            bloodRelation: this.bloodRelation,
            professionalRole: this.professionalRole,
            reputationIndex: this.reputationIndex,
            socialGraphAdjacency: this.socialGraphAdjacency,
            interactionLedger: this.interactionLedger.map(e => e.toJSON()),
            relationshipHistory: this.relationshipHistory.map(h => h.toJSON()),
            unlockedMilestones: this.unlockedMilestones.map(m => m.toJSON()),
            sharedExperienceTags: this.sharedExperienceTags,
            sharedMemoryIds: this.sharedMemoryIds,
            emotionalResonance: this.emotionalResonance,
            relationshipContext: this.relationshipContext,
            relationshipStatistics: this.relationshipStatistics,
            relationshipPermissions: this.relationshipPermissions,
            relationshipRules: this.relationshipRules,
            growthTrajectory: this.growthTrajectory,
            neglectDecayRate: this.neglectDecayRate,
            repairState: this.repairState
        };
    }

    getRelationshipId(): string {
        return this.relationshipId;
    }

    getSourceEntityId(): string {
        return this.sourceEntityId;
    }

    getTargetEntityId(): string {
        return this.targetEntityId;
    }

    getBondType(): BondType {
        return this.bondType;
    }

    getRelationshipStatus(): RelationshipLifecycleState {
        return this.relationshipStatus;
    }

    getMetrics(): RelationshipMetrics {
        return this.metrics;
    }

    getFriendshipLevel(): FriendshipLevel {
        return this.friendshipLevel;
    }

    getRomanceStage(): RomanceStage {
        return this.romanceStage;
    }

    getReputationIndex(): number {
        return this.reputationIndex;
    }

    getSharedMemoryIds(): string[] {
        return [...this.sharedMemoryIds];
    }

    getInteractionLedger(): InteractionLedgerEntry[] {
        return [...this.interactionLedger];
    }

    getRelationshipHistory(): RelationshipHistoryEntry[] {
        return [...this.relationshipHistory];
    }

    getUnlockedMilestones(): MilestoneDescriptor[] {
        return [...this.unlockedMilestones];
    }

    getSocialGraphAdjacency(): string[] {
        return [...this.socialGraphAdjacency];
    }

    addSocialGraphAdjacency(nodeId: string): void {
        if (!this.socialGraphAdjacency.includes(nodeId)) {
            this.socialGraphAdjacency.push(nodeId);
        }
    }

    private evaluateStateTransition(): void {
        if (this.relationshipStatus === "severed") {
            return;
        }

        switch (this.relationshipStatus) {
            case "establishing":
                if (this.metrics.trust > 0.3 && this.metrics.respect > 0.3) {
                    this.relationshipStatus = "active";
                }
                break;
            case "active":
                if (this.metrics.trust < 0.2 || this.metrics.respect < 0.2) {
                    this.relationshipStatus = "strained";
                } else if (this.relationshipStatistics.daysSinceLastInteraction > 30) {
                    this.relationshipStatus = "dormant";
                }
                break;
            case "strained":
                if (this.metrics.trust >= 0.4 && this.metrics.respect >= 0.4 && this.repairState.recoveryProgress > 0.5) {
                    this.relationshipStatus = "active";
                } else if (this.metrics.trust < 0.05 && this.metrics.respect < 0.05) {
                    this.relationshipStatus = "severed";
                    this.uncommittedEvents.push(new RelationshipSeveredEvent(
                        this.relationshipId,
                        this.sourceEntityId,
                        this.targetEntityId,
                        this.metrics.toJSON(),
                        "mutual_neglect",
                        Date.now(),
                        ""
                    ));
                }
                break;
            case "dormant":
                if (this.metrics.trust > 0.4 && this.metrics.respect > 0.4 && this.relationshipStatistics.daysSinceLastInteraction <= 1) {
                    this.relationshipStatus = "active";
                }
                break;
        }
    }

    private evaluateMilestoneUnlock(): void {
        if (this.unlockedMilestones.length >= 100) {
            return;
        }
    }

    private recordHistoryEntry(
        previousMetrics: { trust: number; affinity: number; respect: number; loyalty: number },
        previousStatus: RelationshipLifecycleState,
        trigger: string
    ): void {
        const entry = RelationshipHistoryEntry.create(
            previousMetrics,
            this.metrics.toJSON(),
            previousStatus,
            this.relationshipStatus,
            trigger,
            this.sourceEntityId
        );
        this.relationshipHistory.push(entry);
    }
}
