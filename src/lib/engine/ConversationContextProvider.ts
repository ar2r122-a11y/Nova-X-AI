import { getSharedStorageEngine } from "./SharedInfrastructure";
import { MemoryRepositoryImpl } from "@nova-x-ai/memory";
import { EmotionRepositoryImpl } from "@nova-x-ai/emotion";
import { RelationshipRepositoryImpl } from "@nova-x-ai/relationship";
import { StoryRepositoryImpl } from "@nova-x-ai/story";
import { IConversationContextBuilder } from "@nova-x-ai/conversation";

export class ConversationContextProvider implements IConversationContextBuilder {
    private readonly memoryRepo = new MemoryRepositoryImpl(getSharedStorageEngine());
    private readonly emotionRepo = new EmotionRepositoryImpl(getSharedStorageEngine());
    private readonly relationshipRepo = new RelationshipRepositoryImpl(getSharedStorageEngine());
    private readonly storyRepo = new StoryRepositoryImpl(getSharedStorageEngine());

    async buildContext(characterId: string) {
        const [memoryContext, emotionContext, relationshipContext, storyContext] = await Promise.all([
            this.getMemoryContext(characterId),
            this.getEmotionContext(characterId),
            this.getRelationshipContext(characterId),
            this.getStoryContext()
        ]);

        return {
            ...(memoryContext !== undefined && { memoryContext }),
            ...(emotionContext !== undefined && { emotionContext }),
            ...(relationshipContext !== undefined && { relationshipContext }),
            ...(storyContext !== undefined && { storyContext }),
        };
    }

    private async getMemoryContext(ownerId: string): Promise<string | undefined> {
        try {
            const memories = await this.memoryRepo.getByOwnerId(ownerId);
            const active = memories.filter(m => m.getState().getValue() === "active");
            if (active.length === 0) return undefined;
            return `Recent Memories:\n${active.slice(0, 5).map((m, i) => `${i + 1}. ${m.getContent()}`).join("\n")}`;
        } catch {
            return undefined;
        }
    }

    private async getEmotionContext(characterId: string): Promise<string | undefined> {
        try {
            const aggregate = await this.emotionRepo.findByCharacterId(characterId);
            if (!aggregate) return undefined;
            const parts = [
                `Current Emotion: ${aggregate.getPrimaryEmotion().getValue()}`,
                `Mood: ${aggregate.getCurrentMood().getMoodName()}`,
                `Stability: ${aggregate.getStabilityIndex().toFixed(2)}`
            ];
            return parts.join("\n");
        } catch {
            return undefined;
        }
    }

    private async getRelationshipContext(characterId: string): Promise<string | undefined> {
        try {
            const all = await this.relationshipRepo.getAll();
            const relevant = all.filter(r => r.getSourceEntityId() === characterId || r.getTargetEntityId() === characterId);
            if (relevant.length === 0) return undefined;
            const rel = relevant[0];
            const metrics = rel.getMetrics();
            return `Relationship: ${rel.getBondType()} (${rel.getRelationshipStatus()})\nTrust: ${metrics.trust.toFixed(2)}, Affinity: ${metrics.affinity.toFixed(2)}`;
        } catch {
            return undefined;
        }
    }

    private async getStoryContext(): Promise<string | undefined> {
        try {
            const stories = await this.storyRepo.getAll();
            if (stories.length === 0) return undefined;
            const activeStory = stories.find(s => s.getStatus().getValue() === "active");
            if (!activeStory) return undefined;
            return `Story: ${activeStory.getTitle()}`;
        } catch {
            return undefined;
        }
    }
}
