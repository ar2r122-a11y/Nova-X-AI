import { IEventBus, IDomainEvent, IEventHandler } from "@nova-x-ai/core";

export class AudioStreamProjectionHandler implements IEventHandler<IDomainEvent> {
    async handle(event: IDomainEvent): Promise<void> {
        if (event.eventType === "EVT_VOICE_AudioChunk") {
        }
    }
}
