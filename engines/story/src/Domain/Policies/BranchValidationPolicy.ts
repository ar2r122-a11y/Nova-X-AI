import { Branch } from "../Entities/Branch";
import { QuestStatus } from "../ValueObjects/QuestStatus";

export class BranchValidationPolicy {
    static validateBranch(
        branch: Branch,
        currentFlags: Map<string, unknown>,
        questStatuses: Map<string, QuestStatus>,
        chapterProgress: number
    ): boolean {
        const condition = branch.getCondition();

        if (!branch.isActive()) {
            return false;
        }

        const conditionType = condition.getConditionType();

        if (conditionType === "always") {
            return true;
        }

        if (conditionType === "flag") {
            const requiredFlags = condition.getRequiredFlagsRecord();
            for (const [key, expectedValue] of Object.entries(requiredFlags)) {
                const flagValue = currentFlags.get(key);
                if (flagValue === undefined || flagValue !== expectedValue) {
                    return false;
                }
            }
            return true;
        }

        if (conditionType === "quest_status") {
            const requiredQuestStatus = condition.getRequiredQuestStatus();
            for (const [questId, requiredStatus] of requiredQuestStatus.entries()) {
                const actualStatus = questStatuses.get(questId);
                    if (actualStatus === undefined || actualStatus !== requiredStatus.getValue()) {
                    return false;
                }
            }
            return true;
        }

        if (conditionType === "chapter_progress") {
            return chapterProgress >= condition.getRequiredChapterProgress();
        }

        return false;
    }

    static getSatisfiedBranches(
        branches: Branch[],
        context: Record<string, unknown>
    ): Branch[] {
        const currentFlags = new Map(Object.entries(context.flags || {}).map(([k, v]) => [k, v as unknown]));
        const questStatuses = new Map(
            Object.entries(context.questStatuses || {}).map(([k, v]) => [k, v as QuestStatus])
        );
        const chapterProgress = (context.chapterProgress as number) ?? 0;

        const satisfied = branches
            .filter((branch) =>
                BranchValidationPolicy.validateBranch(branch, currentFlags, questStatuses, chapterProgress)
            )
            .sort((a, b) => {
                const priorityA = a.getPriority().getValue();
                const priorityB = b.getPriority().getValue();
                if (priorityA !== priorityB) {
                    return priorityA.localeCompare(priorityB);
                }
                return a.getBranchId().getValue().localeCompare(b.getBranchId().getValue());
            });

        return satisfied;
    }
}
