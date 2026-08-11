import { UpdateQuestCommand } from "../Commands/UpdateQuestCommand";
import { QuestDto } from "../DTO/QuestDto";
import { IStoryRepository } from "../../Domain/Repositories/IStoryRepository";
import { IQuestRepository } from "../../Domain/Repositories/IQuestRepository";
import { StoryAuthorizationPolicy } from "../../Domain/Policies/StoryAuthorizationPolicy";
import { StoryId } from "../../Domain/ValueObjects/StoryId";
import { QuestId } from "../../Domain/ValueObjects/QuestId";

export class UpdateQuestCommandHandler {
    constructor(
        private readonly storyRepository: IStoryRepository,
        private readonly questRepository: IQuestRepository
    ) {}

    async handle(command: UpdateQuestCommand): Promise<QuestDto> {
        if (!StoryAuthorizationPolicy.canUpdateQuest("", command.claims)) {
            throw new Error("Unauthorized: user is not authorized to update quests.");
        }

        const questId = QuestId.create(command.questId);
        const quest = await this.questRepository.getById(questId);
        if (!quest) {
            throw new Error(`Quest not found: ${command.questId}`);
        }

        switch (command.action) {
            case "activate":
                quest.activate();
                break;
            case "complete":
                quest.complete();
                break;
            case "fail":
                quest.fail("Failed via command");
                break;
            default:
                throw new Error(`Invalid quest action: ${command.action}`);
        }

        await this.questRepository.save(quest);
        quest.commitEvents();
        return QuestDto.fromAggregate(quest);
    }
}
