import type { ICommandHandler } from "@nova-x-ai/core";
import type { ISecurityEngine } from "../../Contracts";
import { LogSafetyEventCommand } from "../Commands";
import { SafetyViolationEvent } from "../../Domain/Events";

export class LogSafetyEventHandler implements ICommandHandler<LogSafetyEventCommand> {
    constructor(private readonly security: ISecurityEngine) {}

    async handle(command: LogSafetyEventCommand): Promise<void> {
        const event = {
            eventId: `safety-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            eventType: command.eventType,
            severity: command.severity,
            source: command.source,
            identityId: command.identityId,
            resource: command.resource,
            action: command.action,
            details: command.details,
            timestamp: Date.now(),
            correlationId: `security-${Date.now()}`
        };

        await this.security.appendSafetyEvent(event as any);

        const correlationId = `security-${Date.now()}`;
        await this.security.eventBus.publish(
            new SafetyViolationEvent(
                event.eventId,
                command.source,
                command.severity,
                command.resource,
                command.action,
                correlationId
            )
        );
    }
}
