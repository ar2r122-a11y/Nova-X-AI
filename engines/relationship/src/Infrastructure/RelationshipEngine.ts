import type { IEventBus } from "@nova-x-ai/core";
import type { IRelationshipEngine } from "../Contracts/IRelationshipEngine";
import type { IRelationshipRepository } from "../Domain/Repositories/IRelationshipRepository";
import { EstablishRelationshipCommandHandler } from "../Application/Handlers/EstablishRelationshipCommandHandler";
import { UpdateRelationshipMetricsCommandHandler } from "../Application/Handlers/UpdateRelationshipMetricsCommandHandler";
import { UnlockRelationshipMilestoneCommandHandler } from "../Application/Handlers/UnlockRelationshipMilestoneCommandHandler";
import { ExecuteRelationshipDecayCommandHandler } from "../Application/Handlers/ExecuteRelationshipDecayCommandHandler";
import { GetRelationshipQueryHandler } from "../Application/Handlers/GetRelationshipQueryHandler";
import { GetRelationshipContextQueryHandler } from "../Application/Handlers/GetRelationshipContextQueryHandler";
import { GetSocialGraphQueryHandler } from "../Application/Handlers/GetSocialGraphQueryHandler";
import { RelationshipSnapshotDto } from "../Application/DTO/RelationshipSnapshotDto";
import { RelationshipContextDto } from "../Application/DTO/RelationshipContextDto";
import { SocialGraphNodeDto } from "../Application/DTO/SocialGraphNodeDto";
import { EstablishRelationshipCommand } from "../Application/Commands/EstablishRelationshipCommand";
import { UpdateRelationshipMetricsCommand } from "../Application/Commands/UpdateRelationshipMetricsCommand";
import { ExecuteRelationshipDecayCommand } from "../Application/Commands/ExecuteRelationshipDecayCommand";
import { UnlockRelationshipMilestoneCommand } from "../Application/Commands/UnlockRelationshipMilestoneCommand";
import { DecayWorker } from "./Workers/DecayWorker";
import type { IRelationshipWorker } from "../Contracts/IRelationshipEngine";

export class RelationshipEngine implements IRelationshipEngine {
    readonly eventBus: IEventBus;
    private repository: IRelationshipRepository;
    private workers: IRelationshipWorker[] = [];
    private initialized = false;

    constructor(eventBus: IEventBus, repository: IRelationshipRepository) {
        this.eventBus = eventBus;
        this.repository = repository;
    }

    getRepository(): IRelationshipRepository {
        return this.repository;
    }

    async establishRelationship(command: {
        relationshipId: string;
        sourceEntityId: string;
        targetEntityId: string;
        bondType: string;
    }): Promise<RelationshipSnapshotDto> {
        const handler = new EstablishRelationshipCommandHandler(this.eventBus, this.repository);
        return handler.handle(new EstablishRelationshipCommand(
            command.relationshipId,
            command.sourceEntityId,
            command.targetEntityId,
            command.bondType as any
        ));
    }

    async updateRelationshipMetrics(command: {
        relationshipId: string;
        trustDelta: number;
        affinityDelta: number;
        respectDelta: number;
        loyaltyDelta: number;
        interactionType: string;
        emotionalValence: number;
        contextTags: string[];
        sharedMemoryIds: string[];
    }): Promise<RelationshipSnapshotDto> {
        const handler = new UpdateRelationshipMetricsCommandHandler(this.eventBus, this.repository);
        return handler.handle(new UpdateRelationshipMetricsCommand(
            command.relationshipId,
            command.trustDelta,
            command.affinityDelta,
            command.respectDelta,
            command.loyaltyDelta,
            command.interactionType,
            command.emotionalValence,
            command.contextTags,
            command.sharedMemoryIds
        ));
    }

    async unlockRelationshipMilestone(command: {
        relationshipId: string;
        milestoneId: string;
        name: string;
        description: string;
        requiredTrust: number;
        requiredAffinity: number;
        requiredRespect: number;
        requiredLoyalty: number;
        requiredBondType: string;
    }): Promise<void> {
        const handler = new UnlockRelationshipMilestoneCommandHandler(this.eventBus, this.repository);
        await handler.handle(new UnlockRelationshipMilestoneCommand(
            command.relationshipId,
            command.milestoneId,
            command.name,
            command.description,
            command.requiredTrust,
            command.requiredAffinity,
            command.requiredRespect,
            command.requiredLoyalty,
            command.requiredBondType
        ));
    }

    async executeRelationshipDecay(relationshipId: string, deltaTimeMs: number): Promise<void> {
        const handler = new ExecuteRelationshipDecayCommandHandler(this.eventBus, this.repository);
        await handler.handle(new ExecuteRelationshipDecayCommand(relationshipId, deltaTimeMs));
    }

    async getRelationship(relationshipId: string): Promise<RelationshipSnapshotDto> {
        const handler = new GetRelationshipQueryHandler(this.repository);
        return handler.handle(new (await import("../Application/Queries/GetRelationshipQuery")).GetRelationshipQuery(relationshipId, ""));
    }

    async getRelationshipContext(relationshipId: string): Promise<RelationshipContextDto> {
        const handler = new GetRelationshipContextQueryHandler(this.repository);
        return handler.handle(new (await import("../Application/Queries/GetRelationshipContextQuery")).GetRelationshipContextQuery(relationshipId, ""));
    }

    async getSocialGraph(entityId: string): Promise<SocialGraphNodeDto> {
        const handler = new GetSocialGraphQueryHandler(this.repository);
        return handler.handle(new (await import("../Application/Queries/GetSocialGraphQuery")).GetSocialGraphQuery(entityId, ""));
    }

    async initialize(): Promise<void> {
        if (this.initialized) {
            return;
        }

        this.eventBus.subscribe("EVT_EMOT_EmotionalStateChanged", {
            handle: async (event: any) => {
                await this.processEmotionalInfluence(event);
            }
        });

        const decayWorker = new DecayWorker();
        decayWorker.setEngine(this);
        this.workers = [decayWorker];

        for (const worker of this.workers) {
            await worker.start();
        }

        this.initialized = true;
    }

    private async processEmotionalInfluence(event: any): Promise<void> {
        const relationships = await this.repository.getAll();
        for (const relationship of relationships) {
            if (relationship.getSourceEntityId() === event.characterId || relationship.getTargetEntityId() === event.characterId) {
                const emotionalValence = event.pleasure || 0;
                await this.updateRelationshipMetrics({
                    relationshipId: relationship.getRelationshipId(),
                    trustDelta: 0,
                    affinityDelta: 0,
                    respectDelta: 0,
                    loyaltyDelta: 0,
                    interactionType: "emotional_influence",
                    emotionalValence,
                    contextTags: [],
                    sharedMemoryIds: []
                });
            }
        }
    }

    async shutdown(): Promise<void> {
        for (const worker of this.workers) {
            await worker.stop();
        }
        this.workers = [];
        this.initialized = false;
    }
}
