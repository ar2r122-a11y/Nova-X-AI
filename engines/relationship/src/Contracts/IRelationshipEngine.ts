import type { IEventBus } from "@nova-x-ai/core";
import type { IRelationshipRepository } from "../Domain/Repositories/IRelationshipRepository";
import { RelationshipSnapshotDto } from "../Application/DTO/RelationshipSnapshotDto";
import { RelationshipContextDto } from "../Application/DTO/RelationshipContextDto";
import { SocialGraphNodeDto } from "../Application/DTO/SocialGraphNodeDto";

export interface IRelationshipEngine {
    readonly eventBus: IEventBus;
    establishRelationship(command: {
        relationshipId: string;
        sourceEntityId: string;
        targetEntityId: string;
        bondType: string;
    }): Promise<RelationshipSnapshotDto>;
    updateRelationshipMetrics(command: {
        relationshipId: string;
        trustDelta: number;
        affinityDelta: number;
        respectDelta: number;
        loyaltyDelta: number;
        interactionType: string;
        emotionalValence: number;
        contextTags: string[];
        sharedMemoryIds: string[];
    }): Promise<RelationshipSnapshotDto>;
    unlockRelationshipMilestone(command: {
        relationshipId: string;
        milestoneId: string;
        name: string;
        description: string;
        requiredTrust: number;
        requiredAffinity: number;
        requiredRespect: number;
        requiredLoyalty: number;
        requiredBondType: string;
    }): Promise<void>;
    executeRelationshipDecay(relationshipId: string, deltaTimeMs: number): Promise<void>;
    getRelationship(relationshipId: string): Promise<RelationshipSnapshotDto>;
    getRelationshipContext(relationshipId: string): Promise<RelationshipContextDto>;
    getSocialGraph(entityId: string): Promise<SocialGraphNodeDto>;
    initialize(): Promise<void>;
    shutdown(): Promise<void>;
    getRepository(): IRelationshipRepository;
}

export interface IRelationshipWorker {
    start(): Promise<void>;
    stop(): Promise<void>;
    isRunning(): boolean;
    getWorkerName(): string;
}

export interface IRelationshipSocialGraph {
    getAdjacency(entityId: string): Promise<string[]>;
    getMutualConnections(entityId: string, targetId: string): Promise<string[]>;
    updateGraph(relationshipId: string, sourceId: string, targetId: string): Promise<void>;
}

export interface IRelationshipCalculator {
    calculateTrustDelta(aggregate: any, interactionType: string, emotionalValence: number): number;
    calculateAffinityDelta(aggregate: any, interactionType: string, emotionalValence: number): number;
    calculateRespectDelta(aggregate: any, interactionType: string, emotionalValence: number): number;
    calculateLoyaltyDelta(aggregate: any, interactionType: string, emotionalValence: number): number;
}
