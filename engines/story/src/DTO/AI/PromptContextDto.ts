import { StoryAggregate } from "../../Domain/Aggregates/StoryAggregate";

export class PromptContextDto {
    storyId: string;
    activeScene: { sceneId: string; title: string; description: string } | null;
    participants: string[];
    recentNarrativeLedgerEntries: Array<{
        eventType: string;
        timestamp: number;
        payload: Record<string, unknown>;
        version: number;
    }>;
    activeNarrativeVariables: Record<string, unknown>;

    constructor(
        storyId: string,
        activeScene: { sceneId: string; title: string; description: string } | null,
        participants: string[],
        recentNarrativeLedgerEntries: Array<{
            eventType: string;
            timestamp: number;
            payload: Record<string, unknown>;
            version: number;
        }>,
        activeNarrativeVariables: Record<string, unknown>
    ) {
        this.storyId = storyId;
        this.activeScene = activeScene;
        this.participants = participants;
        this.recentNarrativeLedgerEntries = recentNarrativeLedgerEntries;
        this.activeNarrativeVariables = activeNarrativeVariables;
    }

    static fromAggregate(aggregate: StoryAggregate): PromptContextDto {
        const activeScene = aggregate.getScenes().find((s) => s.getStatus().getValue() === "active");
        const sceneDto = activeScene
            ? {
                  sceneId: activeScene.getSceneId().getValue(),
                  title: activeScene.getTitle(),
                  description: activeScene.getDescription(),
              }
            : null;

        const participants = activeScene
            ? activeScene
                  .getChoices()
                  .map((c) => c.text)
                  .filter((text): text is string => typeof text === "string")
            : [];

        const flags: Record<string, unknown> = {};
        aggregate.getFlags().forEach((value, key) => {
            flags[key] = value;
        });

        return new PromptContextDto(
            aggregate.getStoryId().getValue(),
            sceneDto,
            participants,
            [],
            flags
        );
    }

    withRecentNarrativeLedgerEntries(
        entries: Array<{
            eventType: string;
            timestamp: number;
            payload: Record<string, unknown>;
            version: number;
        }>
    ): PromptContextDto {
        this.recentNarrativeLedgerEntries = entries;
        return this;
    }
}
