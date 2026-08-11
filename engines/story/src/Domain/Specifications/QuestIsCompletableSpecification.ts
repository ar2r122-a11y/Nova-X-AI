import { Quest } from "../Entities/Quest";

export class QuestIsCompletableSpecification {
    static isSatisfiedBy(quest: Quest): boolean {
        const status = quest.getStatus().getValue();
        if (status !== "active") {
            return false;
        }
        return quest.canComplete();
    }
}
