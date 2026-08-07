/**
 * Nova X AI
 * Nova Core
 * Internal Event Bus Contract
 */

export interface IDomainEvent {
    readonly eventType: string;
    readonly timestamp: number;
    readonly correlationId: string;
}

export interface IEventHandler<T extends IDomainEvent> {
    handle(event: T): Promise<void>;
}

export interface IEventBus {
    publish<T extends IDomainEvent>(
        event: T
    ): Promise<void>;

    subscribe<T extends IDomainEvent>(
        eventType: string,
        handler: IEventHandler<T>
    ): void;
}