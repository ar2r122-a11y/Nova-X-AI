import { StoryAggregate } from "../../Domain/Aggregates/StoryAggregate";

export class StorySummaryDto {
    storyId: string;
    title: string;
    description: string;
    status: string;
    state: string;
    version: number;
    createdAt: number;
    updatedAt: number;

    constructor(
        storyId: string,
        title: string,
        description: string,
        status: string,
        state: string,
        version: number,
        createdAt: number,
        updatedAt: number
    ) {
        this.storyId = storyId;
        this.title = title;
        this.description = description;
        this.status = status;
        this.state = state;
        this.version = version;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromAggregate(aggregate: StoryAggregate): StorySummaryDto {
        return new StorySummaryDto(
            aggregate.getStoryId().getValue(),
            aggregate.getTitle(),
            aggregate.getDescription(),
            aggregate.getStatus().getValue(),
            aggregate.getState().getValue(),
            aggregate.getVersion().getValue(),
            aggregate.getCreatedAt(),
            aggregate.getUpdatedAt()
        );
    }
}
