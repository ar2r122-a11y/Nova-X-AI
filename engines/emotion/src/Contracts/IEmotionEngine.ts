import type { IEventBus } from "@nova-x-ai/core";
import type { IEmotionRepository } from "../Domain/Repositories/IEmotionRepository";
import { EmotionalSnapshotDto } from "../Application/DTO/EmotionalSnapshotDto";
import { EmotionalContextDto } from "../Application/DTO/EmotionalContextDto";

export interface IEmotionEngine {
    readonly eventBus: IEventBus;
    getEmotionalState(characterId: string): Promise<EmotionalSnapshotDto>;
    processStimulus(characterId: string, stimulus: {
        sourceId: string;
        stimulusType: string;
        intensity: number;
        valence: number;
        associatedMemoryId?: string;
    }, sensitivity: number): Promise<EmotionalSnapshotDto>;
    evaluateDecay(characterId: string, deltaTimeMs: number): Promise<void>;
    getEmotionalContext(characterId: string): Promise<EmotionalContextDto>;
    initialize(): Promise<void>;
    shutdown(): Promise<void>;
    getRepository(): IEmotionRepository;
}

export interface IEmotionalStimulus {
    sourceId: string;
    stimulusType: string;
    intensity: number;
    valence: number;
    associatedMemoryId?: string;
}

export interface IEmotionWorker {
    start(): Promise<void>;
    stop(): Promise<void>;
    isRunning(): boolean;
    getWorkerName(): string;
}
