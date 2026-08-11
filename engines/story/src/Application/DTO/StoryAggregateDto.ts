import { StoryAggregate } from "../../Domain/Aggregates/StoryAggregate";
import { StoryProgressDto } from "./StoryProgressDto";
import { SceneDetailsDto } from "./SceneDetailsDto";
import { QuestDto } from "./QuestDto";
import { BranchDto } from "./BranchDto";

export class StoryAggregateDto {
    storyId: string;
    title: string;
    description: string;
    state: string;
    status: string;
    version: number;
    progress: StoryProgressDto;
    chapters: Record<string, unknown>[];
    scenes: SceneDetailsDto[];
    quests: QuestDto[];
    endings: Record<string, unknown>[];
    branches: BranchDto[];
    flags: Record<string, unknown>;
    createdAt: number;
    updatedAt: number;

    constructor(
        storyId: string,
        title: string,
        description: string,
        state: string,
        status: string,
        version: number,
        progress: StoryProgressDto,
        chapters: Record<string, unknown>[],
        scenes: SceneDetailsDto[],
        quests: QuestDto[],
        endings: Record<string, unknown>[],
        branches: BranchDto[],
        flags: Record<string, unknown>,
        createdAt: number,
        updatedAt: number
    ) {
        this.storyId = storyId;
        this.title = title;
        this.description = description;
        this.state = state;
        this.status = status;
        this.version = version;
        this.progress = progress;
        this.chapters = chapters;
        this.scenes = scenes;
        this.quests = quests;
        this.endings = endings;
        this.branches = branches;
        this.flags = flags;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromAggregate(aggregate: StoryAggregate): StoryAggregateDto {
        const flags: Record<string, unknown> = {};
        aggregate.getFlags().forEach((value, key) => {
            flags[key] = value;
        });

        const chapters = aggregate.getChapters().map((chapter) => chapter.toSnapshot());
        const scenes = aggregate.getScenes().map((scene) => SceneDetailsDto.fromEntity(scene));
        const quests = aggregate.getQuests().map((quest) => QuestDto.fromEntity(quest));
        const endings = aggregate.getEndings().map((ending) => ending.toSnapshot());
        const branches = aggregate.getBranches().map((branch) => BranchDto.fromEntity(branch));

        return new StoryAggregateDto(
            aggregate.getStoryId().getValue(),
            aggregate.getTitle(),
            aggregate.getDescription(),
            aggregate.getState().getValue(),
            aggregate.getStatus().getValue(),
            aggregate.getVersion().getValue(),
            StoryProgressDto.fromProgress(aggregate.getProgress()),
            chapters,
            scenes,
            quests,
            endings,
            branches,
            flags,
            aggregate.getCreatedAt(),
            aggregate.getUpdatedAt()
        );
    }
}
