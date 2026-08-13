import type { IStorageEngine } from "@nova-x-ai/storage";
import type { ICharacterRepository } from "../../Contracts/ICharacterRepository";
import { CharacterAggregate } from "../../Domain/Aggregates";
import { CharacterAggregateFactory } from "../../Domain/Services/CharacterAggregateFactory";
import type { CharacterTemplate } from "../../Domain/Services/CharacterAggregateFactory";

interface StoredCharacterEntity {
    id: string;
    data: string;
}

export class CharacterRepositoryImpl implements ICharacterRepository {
    private readonly storageRepository: {
        getById(key: string): Promise<StoredCharacterEntity | null>;
        save(entity: StoredCharacterEntity): Promise<void>;
        delete(key: string): Promise<void>;
        exists(key: string): Promise<boolean>;
        getAll(): Promise<StoredCharacterEntity[]>;
    };

    constructor(storageEngine: IStorageEngine) {
        const repo = storageEngine.getRepository<StoredCharacterEntity>("characters");
        this.storageRepository = {
            getById: (key) => repo.getById(key),
            save: (entity) => repo.save(entity),
            delete: (key) => repo.delete(key),
            exists: (key) => repo.exists(key),
            getAll: () => repo.getAll()
        };
    }

    async findById(id: string): Promise<CharacterAggregate | null> {
        const entity = await this.storageRepository.getById(id);
        if (!entity) {
            return null;
        }
        const snapshot = JSON.parse(entity.data);
        const template = this.snapshotToTemplate(snapshot);
        return CharacterAggregateFactory.createFromTemplate(template);
    }

    async save(aggregate: CharacterAggregate): Promise<void> {
        const snapshot = aggregate.getSnapshot();
        const serialized = JSON.stringify(snapshot);
        const entity: StoredCharacterEntity = {
            id: aggregate.getId().getValue(),
            data: serialized
        };
        await this.storageRepository.save(entity);
    }

    async delete(id: string): Promise<void> {
        await this.storageRepository.delete(id);
    }

    async exists(id: string): Promise<boolean> {
        return this.storageRepository.exists(id);
    }

    async getAll(): Promise<CharacterAggregate[]> {
        const entities = await this.storageRepository.getAll();
        const aggregates: CharacterAggregate[] = [];
        for (const entity of entities) {
            const snapshot = JSON.parse(entity.data);
            const template = this.snapshotToTemplate(snapshot);
            aggregates.push(CharacterAggregateFactory.createFromTemplate(template));
        }
        return aggregates;
    }

    async getActiveCharacters(): Promise<CharacterAggregate[]> {
        const all = await this.getAll();
        return all.filter((character) => {
            const status = character.getState().status;
            return status.getValue() === "active" && status.getValue() !== "hibernating";
        });
    }

    private snapshotToTemplate(snapshot: any): CharacterTemplate {
        return {
            name: snapshot.identity.name,
            title: snapshot.identity.title,
            origin: snapshot.identity.origin,
            age: snapshot.identity.age,
            biography: snapshot.profile.biography,
            tagline: snapshot.profile.tagline,
            occupation: snapshot.profile.occupation,
            publicNotes: snapshot.profile.publicNotes,
            visualDescription: snapshot.appearance.visualDescription,
            avatarUri: snapshot.appearance.avatarUri,
            clothingStyle: snapshot.appearance.clothingStyle.value ?? snapshot.appearance.clothingStyle,
            distinguishingMarks: snapshot.appearance.distinguishingMarks,
            tone: snapshot.voiceProfile.tone.value ?? snapshot.voiceProfile.tone,
            pitch: snapshot.voiceProfile.pitch,
            speechTempo: snapshot.voiceProfile.speechTempo,
            vocabularyLevel: snapshot.voiceProfile.vocabularyLevel.value ?? snapshot.voiceProfile.vocabularyLevel,
            dialectNotes: snapshot.voiceProfile.dialectNotes.map((d: any) => d.value ?? d),
            knownFacts: snapshot.knowledge.knownFacts.map((f: any) => f.value ?? f),
            expertiseAreas: snapshot.knowledge.expertiseAreas.map((a: any) => a.value ?? a),
            blindSpots: snapshot.knowledge.blindSpots.map((s: any) => s.value ?? s),
            activeGoals: snapshot.goals.activeGoals.map((g: any) => ({
                description: g.description,
                status: g.status.value ?? g.status,
                progress: g.progress
            })),
            motivations: snapshot.goals.motivations,
            schedule: snapshot.routine.schedule.map((s: any) => ({
                timeBlock: s.timeBlock,
                activity: s.activity,
                worldCoordinate: s.worldCoordinate
            })),
            fallbackBehavior: snapshot.routine.fallbackBehavior,
            skillMatrix: snapshot.skills.skillMatrix.map(([name, prof]: [string, any]) => ({
                skillName: name,
                level: prof.level ?? prof
            })),
            inventoryItems: snapshot.inventory.items.map((item: any) => ({
                id: item.id,
                name: item.name,
                status: item.status.value ?? item.status,
                description: item.description
            })),
            affinityMap: snapshot.relationships.affinityMap.map(([targetId, metric]: [string, any]) => ({
                targetId,
                trust: metric.trust,
                affection: metric.affection,
                familiarity: metric.familiarity
            })),
            currentEmotion: snapshot.emotionalSnapshot.currentEmotion.value ?? snapshot.emotionalSnapshot.currentEmotion,
            arousalLevel: snapshot.emotionalSnapshot.arousalLevel,
            interactionCount: snapshot.statistics.interactionCount,
            evolutionStage: snapshot.statistics.evolutionStage?.value ?? snapshot.statistics.evolutionStage,
            allowedActions: snapshot.capabilities.allowedActions.map((a: any) => a.value ?? a),
            toolAccess: snapshot.capabilities.toolAccess.value ?? snapshot.capabilities.toolAccess,
            privateBoundaries: snapshot.permissions.privateBoundaries.map((b: any) => b.value ?? b),
            accessControlList: snapshot.permissions.accessControlList.map((t: any) => t.value ?? t),
            currentLocation: snapshot.state.currentLocation.value ?? snapshot.state.currentLocation,
            characterStatus: snapshot.state.status.value ?? snapshot.state.status,
            energyLevel: snapshot.state.energyLevel.value ?? snapshot.state.energyLevel,
            moralAlignment: snapshot.personality.moralAlignment.value ?? snapshot.personality.moralAlignment,
            quirks: snapshot.personality.quirks.map((q: any) => q.value ?? q),
            fears: snapshot.personality.fears.map((f: any) => f.value ?? f),
            desires: snapshot.personality.desires.map((d: any) => d.value ?? d),
            traits: snapshot.personality.traits.map(([name, trait]: [string, any]) => ({
                name,
                score: trait.score
            }))
        };
    }
}
