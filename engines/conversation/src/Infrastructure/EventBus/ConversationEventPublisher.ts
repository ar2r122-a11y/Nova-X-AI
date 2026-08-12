import type { IEventBus } from "@nova-x-ai/core";
import { ConversationAggregate } from "../../Domain/Aggregates/ConversationAggregate";

export class ConversationEventPublisher {
    constructor(private readonly eventBus: IEventBus) {}

    public async publishUncommittedEvents(aggregate: ConversationAggregate): Promise<void> {
        const events = aggregate.getUncommittedEvents();
        for (const event of events) {
            await this.eventBus.publish(event);
        }
        aggregate.commitEvents();
    }
}
