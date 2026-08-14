import type { ICommandHandler } from "@nova-x-ai/core";
import type { ISecurityEngine } from "../../Contracts";
import { CreateContentBoundaryCommand } from "../Commands";
import { ContentBoundaryViolationEvent } from "../../Domain/Events";

export class CreateContentBoundaryHandler implements ICommandHandler<CreateContentBoundaryCommand> {
    constructor(private readonly security: ISecurityEngine) {}

    async handle(command: CreateContentBoundaryCommand): Promise<void> {
        const boundary = {
            boundaryId: command.boundaryId,
            name: command.name,
            description: command.description,
            allowedCategories: command.allowedCategories,
            blockedCategories: command.blockedCategories,
            severityThreshold: command.severityThreshold,
            identityId: command.identityId,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        await this.security.addContentBoundary(boundary as any);

        const correlationId = `security-${Date.now()}`;
        await this.security.eventBus.publish(
            new ContentBoundaryViolationEvent(
                command.boundaryId,
                command.identityId ?? "system",
                command.blockedCategories[0] ?? "unknown",
                command.severityThreshold,
                correlationId
            )
        );
    }
}
