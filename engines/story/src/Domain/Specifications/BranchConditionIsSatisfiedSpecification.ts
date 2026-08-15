import { Branch } from "../Entities/Branch";

export class BranchConditionIsSatisfiedSpecification {
    static isSatisfiedBy(branch: Branch, context: Record<string, unknown>): boolean {
        if (!branch.isActive()) {
            return false;
        }

        const condition = branch.getCondition();
        const conditionType = condition.getConditionType();

        if (conditionType === "always") {
            return true;
        }

        if (conditionType === "flag") {
            const requiredFlags = condition.getRequiredFlagsRecord();
            const contextFlags = context.flags as Record<string, unknown> | undefined;
            if (!contextFlags) {
                return false;
            }
            for (const [key, expectedValue] of Object.entries(requiredFlags)) {
                const actualValue = contextFlags[key];
                if (actualValue === undefined || actualValue !== expectedValue) {
                    return false;
                }
            }
            return true;
        }

        if (conditionType === "quest_status") {
            const requiredQuestStatus = condition.getRequiredQuestStatus();
            const contextQuestStatuses = context.questStatuses as Record<string, string> | undefined;
            if (!contextQuestStatuses) {
                return false;
            }
            for (const [questId, requiredStatusRef] of requiredQuestStatus.entries()) {
                const actualStatus = contextQuestStatuses[questId];
                if (actualStatus !== requiredStatusRef.getValue()) {
                    return false;
                }
            }
            return true;
        }

        if (conditionType === "chapter_progress") {
            const chapterProgress = context.chapterProgress as number | undefined;
            if (chapterProgress === undefined) {
                return false;
            }
            return chapterProgress >= condition.getRequiredChapterProgress();
        }

        return false;
    }
}
