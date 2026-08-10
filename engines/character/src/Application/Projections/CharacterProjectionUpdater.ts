import {
    CharacterCreatedEvent,
    CharacterStateChangedEvent,
    CharacterTraitsUpdatedEvent,
    CharacterProfileUpdatedEvent,
    CharacterRoutineCompletedEvent,
    CharacterEmotionalStateUpdatedEvent,
    CharacterEvolutionTriggeredEvent
} from "../../Domain/Events";
import { CharacterReadModel } from "./CharacterReadModel";

export class CharacterProjectionUpdater {
    private readonly models: Map<string, CharacterReadModel> = new Map();

    handleCharacterCreated(event: CharacterCreatedEvent): void {
        const model = new CharacterReadModel(
            event.characterId.getValue(),
            event.name,
            "",
            "unloaded",
            "initial",
            0,
            event.characterId.getValue(),
            event.createdAt,
            event.timestamp
        );
        this.models.set(event.characterId.getValue(), model);
    }

    handleCharacterStateChanged(event: CharacterStateChangedEvent): void {
        const model = this.models.get(event.characterId.getValue());
        if (model) {
            const updated = new CharacterReadModel(
                model.characterId,
                model.name,
                model.title,
                event.newStatus,
                model.evolutionStage,
                model.interactionCount,
                model.ownerId,
                model.createdAt,
                event.timestamp
            );
            this.models.set(event.characterId.getValue(), updated);
        }
    }

    handleCharacterTraitsUpdated(event: CharacterTraitsUpdatedEvent): void {
        const model = this.models.get(event.characterId.getValue());
        if (model) {
            const updated = new CharacterReadModel(
                model.characterId,
                model.name,
                model.title,
                model.status,
                model.evolutionStage,
                model.interactionCount,
                model.ownerId,
                model.createdAt,
                event.timestamp
            );
            this.models.set(event.characterId.getValue(), updated);
        }
    }

    handleCharacterProfileUpdated(event: CharacterProfileUpdatedEvent): void {
        const model = this.models.get(event.characterId.getValue());
        if (model) {
            const updated = new CharacterReadModel(
                model.characterId,
                model.name,
                model.title,
                model.status,
                model.evolutionStage,
                model.interactionCount,
                model.ownerId,
                model.createdAt,
                event.timestamp
            );
            this.models.set(event.characterId.getValue(), updated);
        }
    }

    handleCharacterRoutineCompleted(event: CharacterRoutineCompletedEvent): void {
        const model = this.models.get(event.characterId.getValue());
        if (model) {
            const updated = new CharacterReadModel(
                model.characterId,
                model.name,
                model.title,
                model.status,
                model.evolutionStage,
                model.interactionCount,
                model.ownerId,
                model.createdAt,
                event.timestamp
            );
            this.models.set(event.characterId.getValue(), updated);
        }
    }

    handleCharacterEmotionalStateUpdated(event: CharacterEmotionalStateUpdatedEvent): void {
        const model = this.models.get(event.characterId.getValue());
        if (model) {
            const updated = new CharacterReadModel(
                model.characterId,
                model.name,
                model.title,
                model.status,
                model.evolutionStage,
                model.interactionCount,
                model.ownerId,
                model.createdAt,
                event.timestamp
            );
            this.models.set(event.characterId.getValue(), updated);
        }
    }

    handleCharacterEvolutionTriggered(event: CharacterEvolutionTriggeredEvent): void {
        const model = this.models.get(event.characterId.getValue());
        if (model) {
            const updated = new CharacterReadModel(
                model.characterId,
                model.name,
                model.title,
                model.status,
                event.newStage,
                model.interactionCount,
                model.ownerId,
                model.createdAt,
                event.timestamp
            );
            this.models.set(event.characterId.getValue(), updated);
        }
    }

    getModel(characterId: string): CharacterReadModel | undefined {
        return this.models.get(characterId);
    }

    getAllModels(): CharacterReadModel[] {
        return Array.from(this.models.values());
    }
}
