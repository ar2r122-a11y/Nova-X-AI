import { IDomainEvent } from "@nova-x-ai/core";
import { StoryId } from "../ValueObjects/StoryId";
import { EndingId } from "../ValueObjects/EndingId";
import { Ending } from "../Entities/Ending";
import { StoryVersion } from "../ValueObjects/StoryVersion";

export interface EndingRegistryAggregateProps {
    registryId: string;
    storyId: StoryId;
    endings: Ending[];
    unlockedEndingIds: string[];
    version: StoryVersion;
    createdAt: number;
    updatedAt: number;
}

export class EndingRegistryAggregate {
    private readonly props: EndingRegistryAggregateProps;
    private readonly uncommittedEvents: IDomainEvent[];

    private constructor(props: EndingRegistryAggregateProps) {
        this.props = props;
        this.uncommittedEvents = [];
    }

    static create(storyId: StoryId): EndingRegistryAggregate {
        const now = Date.now();
        return new EndingRegistryAggregate({
            registryId: `ending-registry-${storyId.getValue()}`,
            storyId,
            endings: [],
            unlockedEndingIds: [],
            version: StoryVersion.initial(),
            createdAt: now,
            updatedAt: now,
        });
    }

    static reconstitute(props: EndingRegistryAggregateProps): EndingRegistryAggregate {
        const aggregate = new EndingRegistryAggregate({
            ...props,
        });
        return aggregate;
    }

    getRegistryId(): string {
        return this.props.registryId;
    }

    getStoryId(): StoryId {
        return this.props.storyId;
    }

    getEndings(): readonly Ending[] {
        return this.props.endings;
    }

    getUnlockedEndingIds(): readonly string[] {
        return this.props.unlockedEndingIds;
    }

    getVersion(): StoryVersion {
        return this.props.version;
    }

    getCreatedAt(): number {
        return this.props.createdAt;
    }

    getUpdatedAt(): number {
        return this.props.updatedAt;
    }

    getUncommittedEvents(): readonly IDomainEvent[] {
        return this.uncommittedEvents;
    }

    registerEnding(ending: Ending): void {
        if (this.props.endings.some((e) => e.getId().equals(ending.getId()))) {
            throw new Error(`Ending already registered: ${ending.getId().getValue()}`);
        }
        this.props.endings.push(ending);
        this.props.version = StoryVersion.next(this.props.version);
        this.props.updatedAt = Date.now();
    }

    unlockEnding(endingId: EndingId, context: Record<string, unknown>): void {
        const ending = this.props.endings.find((e) => e.getId().equals(endingId));
        if (!ending) {
            throw new Error(`Ending not found: ${endingId.getValue()}`);
        }

        ending.unlock();
        this.props.unlockedEndingIds.push(endingId.getValue());
        this.props.version = StoryVersion.next(this.props.version);
        this.props.updatedAt = Date.now();
    }

    evaluateEndings(context: Record<string, unknown>): Ending | null {
        for (const ending of this.props.endings) {
            if (!ending.isUnlocked()) {
                continue;
            }

            const conditions: Record<string, unknown> = {};
            ending.getConditions().forEach((value, key) => {
                conditions[key] = value;
            });

            let satisfied = true;
            for (const [key, requiredValue] of Object.entries(conditions)) {
                const contextValue = context[key];
                if (contextValue !== requiredValue) {
                    satisfied = false;
                    break;
                }
            }

            if (satisfied) {
                return ending;
            }
        }

        return null;
    }

    getUnlockedEndingCount(): number {
        return this.props.endings.filter((e) => e.isUnlocked()).length;
    }

    commitEvents(): void {
        this.uncommittedEvents.length = 0;
    }

    getSnapshot(): Record<string, unknown> {
        return {
            registryId: this.props.registryId,
            storyId: this.props.storyId.getValue(),
            endings: this.props.endings.map((e) => e.toSnapshot()),
            unlockedEndingIds: this.props.unlockedEndingIds,
            version: this.props.version.getValue(),
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
        };
    }
}
