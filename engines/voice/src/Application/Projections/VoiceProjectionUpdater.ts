import { IEventBus, IDomainEvent, IEventHandler } from "@nova-x-ai/core";
import { VoiceAggregate } from "../../Domain/Aggregates/VoiceAggregate";
import { VoiceSessionAggregate } from "../../Domain/Aggregates/VoiceSessionAggregate";
import type { IProjectionStore } from "@nova-x-ai/storage";
import type { VoiceReadModel, VoiceSessionReadModel, ProviderHealthReadModel } from "./VoiceReadModel";

export class VoiceProjectionUpdater {
    private running = false;

    constructor(private readonly eventBus: IEventBus, private readonly projectionStore: IProjectionStore) {}

    start(): void {
        if (this.running) return;
        this.running = true;
        this.registerHandlers();
    }

    stop(): void {
        this.running = false;
    }

    private registerHandlers(): void {
        this.eventBus.subscribe("EVT_VOICE_VoiceInitialized", {
            handle: async (event: IDomainEvent) => { /* projection update */ }
        });
        this.eventBus.subscribe("EVT_VOICE_SynthesisStarted", {
            handle: async (event: IDomainEvent) => { /* projection update */ }
        });
        this.eventBus.subscribe("EVT_VOICE_StreamCompleted", {
            handle: async (event: IDomainEvent) => { /* projection update */ }
        });
        this.eventBus.subscribe("EVT_VOICE_StreamInterrupted", {
            handle: async (event: IDomainEvent) => { /* projection update */ }
        });
        this.eventBus.subscribe("EVT_VOICE_SynthesisFailed", {
            handle: async (event: IDomainEvent) => { /* projection update */ }
        });
        this.eventBus.subscribe("EVT_VOICE_ProviderStatusChanged", {
            handle: async (event: IDomainEvent) => { /* projection update */ }
        });
    }

    async getVoiceReadModel(voiceId: string): Promise<VoiceReadModel | null> {
        const key = `voice-projection-${voiceId}`;
        const data = await this.projectionStore.getProjection(key);
        return data as VoiceReadModel | null;
    }

    async saveVoiceReadModel(voiceId: string, model: VoiceReadModel): Promise<void> {
        const key = `voice-projection-${voiceId}`;
        await this.projectionStore.saveProjection(key, model);
    }
}
