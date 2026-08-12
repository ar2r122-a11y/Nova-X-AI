import { IEventBus, IDomainEvent, IEventHandler } from "@nova-x-ai/core";

export class VoiceStateProjectionHandler implements IEventHandler<IDomainEvent> {
    async handle(event: IDomainEvent): Promise<void> {
        if (event.eventType === "EVT_VOICE_VoiceInitialized") {
        }
    }
}
