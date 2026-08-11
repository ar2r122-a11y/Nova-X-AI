import { StoryAggregate } from "../Aggregates/StoryAggregate";
import { Chapter } from "../Entities/Chapter";
import { Quest } from "../Entities/Quest";
import { Objective } from "../Entities/Objective";
import { StoryProgress } from "../ValueObjects/StoryProgress";

export interface IProgressionCalculator {
    calculateStoryProgress(story: StoryAggregate): StoryProgress;
    calculateChapterProgress(chapter: Chapter): number;
    calculateQuestProgress(quest: Quest): number;
    calculateObjectiveProgress(objective: Objective): number;
}
