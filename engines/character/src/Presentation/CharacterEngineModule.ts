import { ICoreModule } from "@nova-x-ai/core";
import type { IContainer, IEventBus } from "@nova-x-ai/core";
import type { IStorageEngine } from "@nova-x-ai/storage";
import { CharacterEngine } from "../Infrastructure/CharacterEngine";
import { CharacterRepositoryImpl } from "../Infrastructure/Persistence/CharacterRepositoryImpl";
import { CharacterRoutineWorker, CharacterEvolutionWorker, CharacterCacheWorker } from "../Infrastructure/Workers";
import type { ICharacterWorker } from "../Contracts/ICharacterWorker";
import { CharacterCreatedEvent, CharacterStateChangedEvent, CharacterTraitsUpdatedEvent, CharacterProfileUpdatedEvent, CharacterRoutineCompletedEvent, CharacterEmotionalStateUpdatedEvent, CharacterEvolutionTriggeredEvent, CharacterBoundaryViolatedEvent } from "../Domain/Events";

const CHARACTER_ENGINE = Symbol("CharacterEngine");

export class CharacterEngineModule implements ICoreModule {
    readonly moduleName = "@nova-x-ai/character";
    private engine: CharacterEngine | null = null;
    private workers: ICharacterWorker[] = [];

    configureServices(container: IContainer): void {
        container.registerSingleton(CHARACTER_ENGINE, CharacterEngine);
    }

    async onInit(): Promise<void> {
        const eventBus = {} as IEventBus;
        const storageEngine = {} as IStorageEngine;
        const contextBuilder = new (await import("../Domain/Services/CharacterContextBuilder")).CharacterContextBuilder();

        const repository = new CharacterRepositoryImpl(storageEngine);
        const engine = new CharacterEngine(eventBus, repository, contextBuilder);

        const routineWorker = new CharacterRoutineWorker();
        const evolutionWorker = new CharacterEvolutionWorker();
        const cacheWorker = new CharacterCacheWorker();

        routineWorker.setCharacterEngine(engine);
        evolutionWorker.setCharacterEngine(engine);
        cacheWorker.setCharacterEngine(engine);

        this.workers = [routineWorker, evolutionWorker, cacheWorker];
        this.engine = engine;

        eventBus.subscribe("EVT_CHAR_CharacterCreated", this.createHandler((event: CharacterCreatedEvent) => this.handleCharacterCreated(event)));
        eventBus.subscribe("EVT_CHAR_CharacterStateChanged", this.createHandler((event: CharacterStateChangedEvent) => this.handleCharacterStateChanged(event)));
        eventBus.subscribe("EVT_CHAR_CharacterTraitsUpdated", this.createHandler((event: CharacterTraitsUpdatedEvent) => this.handleCharacterTraitsUpdated(event)));
        eventBus.subscribe("EVT_CHAR_CharacterProfileUpdated", this.createHandler((event: CharacterProfileUpdatedEvent) => this.handleCharacterProfileUpdated(event)));
        eventBus.subscribe("EVT_CHAR_CharacterRoutineCompleted", this.createHandler((event: CharacterRoutineCompletedEvent) => this.handleCharacterRoutineCompleted(event)));
        eventBus.subscribe("EVT_CHAR_CharacterEmotionalStateUpdated", this.createHandler((event: CharacterEmotionalStateUpdatedEvent) => this.handleCharacterEmotionalStateUpdated(event)));
        eventBus.subscribe("EVT_CHAR_CharacterEvolutionTriggered", this.createHandler((event: CharacterEvolutionTriggeredEvent) => this.handleCharacterEvolutionTriggered(event)));
        eventBus.subscribe("EVT_CHAR_CharacterBoundaryViolated", this.createHandler((event: CharacterBoundaryViolatedEvent) => this.handleCharacterBoundaryViolated(event)));

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

    getCharacterEngine(): CharacterEngine | null {
        return this.engine;
    }

    private createHandler<T>(fn: (event: T) => Promise<void>): { handle: (event: T) => Promise<void> } {
        return { handle: fn };
    }

    private handleCharacterCreated(event: CharacterCreatedEvent): Promise<void> {
        console.log(`Character created: ${event.characterId.getValue()} - ${event.name}`);
        return Promise.resolve();
    }

    private handleCharacterStateChanged(event: CharacterStateChangedEvent): Promise<void> {
        console.log(`Character state changed: ${event.characterId.getValue()} from ${event.previousStatus} to ${event.newStatus}`);
        return Promise.resolve();
    }

    private handleCharacterTraitsUpdated(event: CharacterTraitsUpdatedEvent): Promise<void> {
        console.log(`Character traits updated: ${event.characterId.getValue()} - ${event.updatedTraits.join(", ")}`);
        return Promise.resolve();
    }

    private handleCharacterProfileUpdated(event: CharacterProfileUpdatedEvent): Promise<void> {
        console.log(`Character profile updated: ${event.characterId.getValue()} - ${event.updatedFields.join(", ")}`);
        return Promise.resolve();
    }

    private handleCharacterRoutineCompleted(event: CharacterRoutineCompletedEvent): Promise<void> {
        console.log(`Character routine completed: ${event.characterId.getValue()} - ${event.completedActivity}`);
        return Promise.resolve();
    }

    private handleCharacterEmotionalStateUpdated(event: CharacterEmotionalStateUpdatedEvent): Promise<void> {
        console.log(`Character emotional state updated: ${event.characterId.getValue()} - ${event.emotion}`);
        return Promise.resolve();
    }

    private handleCharacterEvolutionTriggered(event: CharacterEvolutionTriggeredEvent): Promise<void> {
        console.log(`Character evolved: ${event.characterId.getValue()} from ${event.previousStage} to ${event.newStage}`);
        return Promise.resolve();
    }

    private handleCharacterBoundaryViolated(event: CharacterBoundaryViolatedEvent): Promise<void> {
        console.log(`Character boundary violated: ${event.characterId.getValue()} - ${event.boundaryRule}`);
        return Promise.resolve();
    }
}