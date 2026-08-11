import type { IEventBus } from "@nova-x-ai/core";
import type { ICommandValidationPipeline } from "./ICommandValidationPipeline";
import { StorySecurityBoundary } from "../../Infrastructure/Security/StorySecurityBoundary";
import { StorySecurityContext } from "../../Infrastructure/Security/StorySecurityContext";

export class CommandValidationPipeline implements ICommandValidationPipeline {
    constructor(private readonly securityBoundary: StorySecurityBoundary, private readonly eventBus: IEventBus) {}

    async validate<T extends { constructor: { name: string } }>(command: T, context: { correlationId: string; causationId?: string | null; nonce: string; claims: { roles: string[] } }): Promise<T> {
        const securityContext = StorySecurityContext.create({
            userId: "system",
            roles: context.claims.roles,
            permissions: [],
            correlationId: context.correlationId,
            causationId: context.causationId ?? null,
            nonce: context.nonce,
            timestamp: Date.now(),
        });

        await this.securityBoundary.authorizeCommand(command as any, securityContext);

        await this.eventBus.publish({
            eventType: "EVT_STORY_CommandValidated",
            timestamp: Date.now(),
            correlationId: context.correlationId,
            payload: {
                commandType: command.constructor.name,
                nonce: context.nonce,
            },
        });

        return command;
    }
}
