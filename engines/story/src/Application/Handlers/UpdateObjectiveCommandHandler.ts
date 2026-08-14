import { UpdateObjectiveCommand } from "../Commands/UpdateObjectiveCommand";
import { ObjectiveDto } from "../DTO/ObjectiveDto";
import { IQuestRepository } from "../../Domain/Repositories/IQuestRepository";
import { StoryAuthorizationPolicy } from "../../Domain/Policies/StoryAuthorizationPolicy";
import { UpdateObjectiveValidator } from "../Validators/UpdateObjectiveValidator";
import { QuestId } from "../../Domain/ValueObjects/QuestId";
import { ObjectiveId } from "../../Domain/ValueObjects/ObjectiveId";

export class UpdateObjectiveCommandHandler {
    constructor(
        private readonly questRepository: IQuestRepository
    ) {}

    async handle(command: UpdateObjectiveCommand): Promise<ObjectiveDto> {
        UpdateObjectiveValidator.validate(command);
        if (!StoryAuthorizationPolicy.canUpdateQuest("", command.claims)) {
            throw new Error("Unauthorized: user is not authorized to update objectives.");
        }

        const questId = QuestId.create(command.questId);
        const quest = await this.questRepository.getById(questId);
        if (!quest) {
            throw new Error(`Quest not found: ${command.questId}`);
        }

        const objectiveId = ObjectiveId.create(command.objectiveId);
        const objective = quest.getObjectives().find((o) => o.getObjectiveId().equals(objectiveId));
        if (!objective) {
            throw new Error(`Objective not found: ${command.objectiveId}`);
        }

        switch (command.action) {
            case "activate":
                objective.markActive();
                break;
            case "complete":
                objective.complete();
                break;
            case "fail":
                objective.fail();
                break;
            case "setProgress":
                if (command.progress === undefined || command.progress < 0 || command.progress > 100) {
                    throw new Error("Progress must be between 0 and 100.");
                }
                objective.setProgress(command.progress);
                break;
            default:
                throw new Error(`Invalid objective action: ${command.action}`);
        }

        await this.questRepository.save(quest);
        quest.commitEvents();
        return ObjectiveDto.fromEntity(objective);
    }
}
