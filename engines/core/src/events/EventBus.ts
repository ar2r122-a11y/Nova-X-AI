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

    private readonly queue: Array<{
        event: any;
        resolve: () => void;
        reject: (err: Error) => void;
    }> = [];

    private readonly queueLimit: number;

    private workerPromise: Promise<void> | null = null;

    private stopped = false;

    constructor(
        queueLimit: number = 1000
    ) {
        this.queueLimit = queueLimit;
    }

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

        if (this.stopped) {

            throw new Error(
                "EventBus is stopped"
            );

        }

        while (this.queue.length >= this.queueLimit) {

            await new Promise(
                resolve => setTimeout(resolve, 1)
            );

        }

        return new Promise<void>(
            (resolve, reject) => {

                this.queue.push({
                    event,
                    resolve,
                    reject
                });

                this.ensureWorker();

            }
        );

    }

    public async shutdown(): Promise<void> {

        this.stopped = true;

        if (this.workerPromise) {

            await this.workerPromise;

        }

    }

    private ensureWorker(): void {

        if (this.workerPromise) {

            return;

        }

        this.workerPromise = (async () => {

            while (this.queue.length > 0) {

                const item =
                    this.queue.shift()!;

                try {

                    await this.dispatch(
                        item.event
                    );

                    item.resolve();

                } catch (error) {

                    item.reject(
                        error as Error
                    );

                }

            }

            this.workerPromise = null;

        })();

    }

    private async dispatch(
        event: any
    ): Promise<void> {

        const subscribers =
            this.handlers.get(
                event.eventType
            );

        if (!subscribers) {

            return;

        }

        await Promise.all(
            subscribers.map(
                async (handler) => {

                    try {

                        await handler.handle(
                            event
                        );

                    } catch (error) {

                        console.error(
                            `Event handler failed for '${event.eventType}'.`,
                            error
                        );

                    }

                }
            )
        );

    }

}