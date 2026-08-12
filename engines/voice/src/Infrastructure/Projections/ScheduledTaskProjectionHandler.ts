import { IEventBus, IDomainEvent, IEventHandler } from "@nova-x-ai/core";

export class ScheduledTaskProjectionHandler implements IEventHandler<IDomainEvent> {
    async handle(event: IDomainEvent): Promise<void> {
    }
}
