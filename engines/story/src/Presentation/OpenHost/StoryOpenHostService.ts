import type { IEventBus, IDomainEvent } from "@nova-x-ai/core";
import type { IStoryEngine } from "../../Contracts/IStoryEngine";
import type { IStoryEngineOpenApi } from "../../Contracts/IStoryEngineOpenApi";
import { StorySecurityContext } from "../../Infrastructure/Security/StorySecurityContext";
import { StorySecurityBoundary } from "../../Infrastructure/Security/StorySecurityBoundary";
import { StoryEngineAclTranslator } from "../../Infrastructure/ACL/StoryEngineAclTranslator";
import { TimelineDto } from "./Dtos/TimelineDto";
import { StoryStateDto } from "./Dtos/StoryStateDto";
import { CommandResultDto } from "./Dtos/CommandResultDto";
import { QueryResultDto } from "./Dtos/QueryResultDto";
import { StoryAggregateDto } from "../../Application/DTO/StoryAggregateDto";
import { StoryId } from "../../Domain/ValueObjects/StoryId";

export class StoryOpenHostService implements IStoryEngineOpenApi {
    constructor(
        private readonly storyEngine: IStoryEngine,
        private readonly securityBoundary: StorySecurityBoundary,
        private readonly acl: StoryEngineAclTranslator,
        private readonly eventBus: IEventBus
    ) {}

    async getTimeline(storyId: string, requesterId: string, version: string = "v1"): Promise<TimelineDto> {
        const context = StorySecurityContext.create({
            userId: requesterId,
            roles: [],
            permissions: [],
            correlationId: `timeline-${storyId}-${Date.now()}`,
            causationId: null,
            nonce: `nonce-${Date.now()}-${Math.random()}`,
            timestamp: Date.now(),
        });

        await this.securityBoundary.authorizeQuery({ requesterId }, context);

        const events = await this.storyEngine.eventStoreRepository.getStreamEvents(storyId);
        const timelineEvents = events.map((e) => ({
            eventType: e.eventType,
            timestamp: e.timestamp,
            version: e.version,
        }));

        return new TimelineDto(storyId, timelineEvents, version);
    }

    async getStoryState(storyId: string, requesterId: string, version: string = "v1"): Promise<StoryStateDto> {
        const context = StorySecurityContext.create({
            userId: requesterId,
            roles: [],
            permissions: [],
            correlationId: `state-${storyId}-${Date.now()}`,
            causationId: null,
            nonce: `nonce-${Date.now()}-${Math.random()}`,
            timestamp: Date.now(),
        });

        await this.securityBoundary.authorizeQuery({ requesterId }, context);

        const aggregate = await this.storyEngine.storyRepository.getById(StoryId.create(storyId));
        if (!aggregate) {
            throw new Error(`Story not found: ${storyId}`);
        }

        return new StoryStateDto(
            aggregate.getStoryId().getValue(),
            aggregate.getStatus().getValue(),
            aggregate.getState().getValue(),
            aggregate.getVersion().getValue(),
            version
        );
    }

    async executeCommand(command: unknown, version: string, context: unknown): Promise<CommandResultDto> {
        const correlationId = `cmd-${Date.now()}-${Math.random()}`;

        try {
            const securityContext = context as StorySecurityContext;
            await this.securityBoundary.authorizeCommand(command as any, securityContext);

            const internalCommand = this.acl.translateToCommand(command, version);

            await this.eventBus.publish({
                eventType: "EVT_STORY_CommandExecuted",
                timestamp: Date.now(),
                correlationId,
                payload: {
                    command,
                    version,
                    userId: securityContext.userId,
                },
            } as IDomainEvent);

            return new CommandResultDto(true, correlationId, internalCommand);
        } catch (error) {
            const normalizedError = this.acl.normalizeExternalError(error);
            return new CommandResultDto(false, correlationId, undefined, normalizedError.message);
        }
    }

    async executeQuery(query: unknown, version: string, context: unknown): Promise<QueryResultDto> {
        const correlationId = `query-${Date.now()}-${Math.random()}`;

        try {
            const securityContext = context as StorySecurityContext;
            await this.securityBoundary.authorizeQuery(query as any, securityContext);

            const internalQuery = this.acl.translateToQuery(query, version);

            await this.eventBus.publish({
                eventType: "EVT_STORY_QueryExecuted",
                timestamp: Date.now(),
                correlationId,
                payload: {
                    query,
                    version,
                    userId: securityContext.userId,
                },
            } as IDomainEvent);

            return new QueryResultDto(true, correlationId, internalQuery);
        } catch (error) {
            const normalizedError = this.acl.normalizeExternalError(error);
            return new QueryResultDto(false, correlationId, undefined, normalizedError.message);
        }
    }

    async registerExtension(extension: unknown, context: unknown): Promise<void> {
        const securityContext = context as StorySecurityContext;
        await this.securityBoundary.authorizeCommand({ claims: { roles: ["admin"] } }, securityContext);
        await this.eventBus.publish({
            eventType: "EVT_STORY_ExtensionRegistered",
            timestamp: Date.now(),
            correlationId: securityContext.correlationId,
            payload: { extension },
        } as IDomainEvent);
    }
}
