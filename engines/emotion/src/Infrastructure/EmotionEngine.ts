import type { IEventBus } from "@nova-x-ai/core";
import type { IEmotionEngine } from "../Contracts/IEmotionEngine";
import type { IEmotionRepository } from "../Domain/Repositories/IEmotionRepository";
import { ProcessEmotionalStimulusCommandHandler } from "../Application/Handlers/ProcessEmotionalStimulusCommandHandler";
import { ExecuteEmotionalDecayCommandHandler } from "../Application/Handlers/ExecuteEmotionalDecayCommandHandler";
import { GetEmotionalStateQueryHandler } from "../Application/Handlers/GetEmotionalStateQueryHandler";
import { GetEmotionalContextQueryHandler } from "../Application/Handlers/GetEmotionalContextQueryHandler";
import { EmotionalSnapshotDto } from "../Application/DTO/EmotionalSnapshotDto";
import { EmotionalContextDto } from "../Application/DTO/EmotionalContextDto";
import { ProcessEmotionalStimulusCommand } from "../Application/Commands/ProcessEmotionalStimulusCommand";
import { ExecuteEmotionalDecayCommand } from "../Application/Commands/ExecuteEmotionalDecayCommand";
import { DecayWorker, RecoveryWorker } from "./Workers";
import type { IEmotionWorker } from "../Contracts/IEmotionEngine";

export class EmotionEngine implements IEmotionEngine {
    readonly eventBus: IEventBus;
    private repository: IEmotionRepository;
    private workers: IEmotionWorker[] = [];
    private initialized = false;

    constructor(eventBus: IEventBus, repository: IEmotionRepository) {
        this.eventBus = eventBus;
        this.repository = repository;
    }

    getRepository(): IEmotionRepository {
        return this.repository;
    }

    async getEmotionalState(characterId: string): Promise<EmotionalSnapshotDto> {
        const handler = new GetEmotionalStateQueryHandler(this.repository);
        return handler.handle(new (await import("../Application/Queries/GetEmotionalStateQuery")).GetEmotionalStateQuery(characterId, ""));
    }

    async processStimulus(
        characterId: string,
        stimulus: {
            sourceId: string;
            stimulusType: string;
            intensity: number;
            valence: number;
            associatedMemoryId?: string;
        },
        sensitivity: number
    ): Promise<EmotionalSnapshotDto> {
        const handler = new ProcessEmotionalStimulusCommandHandler(this.eventBus, this.repository);
        return handler.handle(new ProcessEmotionalStimulusCommand(characterId, stimulus, sensitivity));
    }

    async evaluateDecay(characterId: string, deltaTimeMs: number): Promise<void> {
        const handler = new ExecuteEmotionalDecayCommandHandler(this.eventBus, this.repository);
        await handler.handle(new ExecuteEmotionalDecayCommand(characterId, deltaTimeMs));
    }

    async getEmotionalContext(characterId: string): Promise<EmotionalContextDto> {
        const handler = new GetEmotionalContextQueryHandler(this.repository);
        return handler.handle(new (await import("../Application/Queries/GetEmotionalContextQuery")).GetEmotionalContextQuery(characterId, ""));
    }

    async initialize(): Promise<void> {
        if (this.initialized) {
            return;
        }

        const decayWorker = new DecayWorker();
        const recoveryWorker = new RecoveryWorker();

        decayWorker.setEngine(this);
        recoveryWorker.setEngine(this);

        this.workers = [decayWorker, recoveryWorker];

        for (const worker of this.workers) {
            await worker.start();
        }

        this.initialized = true;
    }

    async shutdown(): Promise<void> {
        for (const worker of this.workers) {
            await worker.stop();
        }
        this.workers = [];
        this.initialized = false;
    }
}
