import {
    IEventBus,
    IDomainEvent,
    IEventHandler
} from "./IEventBus";

export class EventBus implements IEventBus {

    private readonly handlers = new Map<
        string,
        IEventHandler<any>[]
    >();

    public subscribe<T extends IDomainEvent>(
        eventType: string,
        handler: IEventHandler<T>
    ): void {

        if (!this.handlers.has(eventType)) {
            this.handlers.set(eventType, []);
        }

        this.handlers.get(eventType)!.push(handler);

    }

    public async publish<T extends IDomainEvent>(
        event: T
    ): Promise<void> {

        const subscribers =
            this.handlers.get(event.eventType);

        if (!subscribers) {
            return;
        }

        for (const handler of subscribers) {

            try {

                await handler.handle(event);

            }
            catch (error) {

                console.error(
                    `Event handler failed for '${event.eventType}'.`,
                    error
                );

            }

        }

    }

}