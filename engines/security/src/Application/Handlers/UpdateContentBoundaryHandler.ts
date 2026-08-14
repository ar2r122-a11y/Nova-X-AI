import type { ICommandHandler } from "@nova-x-ai/core";
import type { ISecurityEngine } from "../../Contracts";
import { UpdateContentBoundaryCommand } from "../Commands";

export class UpdateContentBoundaryHandler implements ICommandHandler<UpdateContentBoundaryCommand> {
    constructor(private readonly security: ISecurityEngine) {}

    async handle(command: UpdateContentBoundaryCommand): Promise<void> {
        const existing = this.security.getContentBoundary(command.boundaryId);
        if (!existing) {
            throw new Error(`Content boundary not found: ${command.boundaryId}`);
        }

        const updated = {
            ...existing,
            allowedCategories: command.allowedCategories ?? existing.allowedCategories,
            blockedCategories: command.blockedCategories ?? existing.blockedCategories,
            severityThreshold: command.severityThreshold ?? existing.severityThreshold,
            updatedAt: Date.now()
        };

        this.security.addContentBoundary(updated as any);
    }
}
