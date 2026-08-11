import { Ending } from "../Entities/Ending";
import { QuestStatus } from "../ValueObjects/QuestStatus";

export class EndingEvaluationPolicy {
    static canUnlockEnding(
        ending: Ending,
        flags: Map<string, unknown>,
        questStatuses: Map<string, QuestStatus>
    ): boolean {
        if (ending.isUnlocked()) {
            return true;
        }

        const conditions = ending.getConditions();

        const requiredFlags = conditions.get("required_flags");
        if (requiredFlags !== undefined && typeof requiredFlags === "object" && requiredFlags !== null) {
            const flagRecord = requiredFlags as Record<string, unknown>;
            for (const [key, expectedValue] of Object.entries(flagRecord)) {
                const flagValue = flags.get(key);
                if (flagValue === undefined || flagValue !== expectedValue) {
                    return false;
                }
            }
        }

        const requiredQuests = conditions.get("required_quests");
        if (requiredQuests !== undefined && typeof requiredQuests === "object" && requiredQuests !== null) {
            const questRecord = requiredQuests as Record<string, string>;
            for (const [questId, expectedStatus] of Object.entries(questRecord)) {
                const actualStatus = questStatuses.get(questId);
                if (actualStatus !== expectedStatus) {
                    return false;
                }
            }
        }

        const minProgress = conditions.get("min_chapter_progress");
        if (minProgress !== undefined && typeof minProgress === "number") {
            const chapterProgress = conditions.get("chapter_progress");
            if (typeof chapterProgress !== "number" || chapterProgress < minProgress) {
                return false;
            }
        }

        return true;
    }

    static evaluateConditions(ending: Ending, context: Record<string, unknown>): boolean {
        const conditions = ending.getConditions();

        for (const [key, expectedValue] of conditions.entries()) {
            const contextValue = context[key];
            if (contextValue === undefined) {
                return false;
            }

            if (typeof expectedValue === "object" && expectedValue !== null && !Array.isArray(expectedValue)) {
                const expectedRecord = expectedValue as Record<string, unknown>;
                const contextRecord = contextValue as Record<string, unknown>;
                for (const [subKey, subExpected] of Object.entries(expectedRecord)) {
                    const subActual = contextRecord[subKey];
                    if (subActual !== subExpected) {
                        return false;
                    }
                }
            } else if (contextValue !== expectedValue) {
                return false;
            }
        }

        return true;
    }
}
