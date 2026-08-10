import { ICoreModule } from "@nova-x-ai/core";
import type { IContainer, IEventBus } from "@nova-x-ai/core";
import type { IStorageEngine } from "@nova-x-ai/storage";
import { EmotionEngine } from "../Infrastructure/EmotionEngine";
import { EmotionRepositoryImpl } from "../Infrastructure/Persistence/EmotionRepositoryImpl";
import { DecayWorker, RecoveryWorker } from "../Infrastructure/Workers";
import type { IEmotionWorker } from "../Contracts/IEmotionEngine";
import {
    EmotionalStateChangedEvent,
    MoodShiftedEvent,
    EmotionalBreakpointReachedEvent
} from "../Domain/Events";

const EMOTION_ENGINE = Symbol("EmotionEngine");

export class EmotionEngineModule implements ICoreModule {
    readonly moduleName = "@nova-x-ai/emotion";
    private engine: EmotionEngine | null = null;
    private workers: IEmotionWorker[] = [];

    configureServices(container: IContainer): void {
        container.registerSingleton(EMOTION_ENGINE, EmotionEngine);
    }

    async onInit(): Promise<void> {
        const eventBus = {} as IEventBus;
        const storageEngine = {} as IStorageEngine;

        const repository = new EmotionRepositoryImpl(storageEngine);
        const engine = new EmotionEngine(eventBus, repository);

        const decayWorker = new DecayWorker();
        const recoveryWorker = new RecoveryWorker();

        decayWorker.setEngine(engine);
        recoveryWorker.setEngine(engine);

        this.workers = [decayWorker, recoveryWorker];
        this.engine = engine;

        eventBus.subscribe("EVT_EMOT_EmotionalStateChanged", this.createHandler((event: EmotionalStateChangedEvent) => this.handleEmotionalStateChanged(event)));
        eventBus.subscribe("EVT_EMOT_MoodShifted", this.createHandler((event: MoodShiftedEvent) => this.handleMoodShifted(event)));
        eventBus.subscribe("EVT_EMOT_EmotionalBreakpointReached", this.createHandler((event: EmotionalBreakpointReachedEvent) => this.handleBreakpointReached(event)));
        for (const worker of this.workers) {
            await worker.start();
        }
    }

    async onDestroy(): Promise<void> {
        for (const worker of this.workers) {
            await worker.stop();
        }
        this.workers = [];
        this.engine = null;
    }

    getEmotionEngine(): EmotionEngine | null {
        return this.engine;
    }

    private createHandler<T>(fn: (event: T) => Promise<void>): { handle: (event: T) => Promise<void> } {
        return { handle: fn };
    }

    private handleEmotionalStateChanged(_event: EmotionalStateChangedEvent): Promise<void> {
        return Promise.resolve();
    }

    private handleMoodShifted(_event: MoodShiftedEvent): Promise<void> {
        return Promise.resolve();
    }

    private handleBreakpointReached(_event: EmotionalBreakpointReachedEvent): Promise<void> {
        return Promise.resolve();
    }}
