import { Objective } from "../Entities/Objective";

export class ObjectiveEvaluationPolicy {
    static canCompleteObjective(objective: Objective, flags: Map<string, unknown>): boolean {
        const requiredFlags = objective.getRequiredFlags();
        for (const [key, value] of requiredFlags.entries()) {
            const flagValue = flags.get(key);
            if (flagValue === undefined || flagValue !== value) {
                return false;
            }
        }
        return true;
    }

    static evaluateProgress(objective: Objective, context: Record<string, unknown>): number {
        const completionCriteria = objective.getCompletionCriteria();
        let matched = 0;
        for (const [key, expectedValue] of completionCriteria.entries()) {
            const contextValue = context[key];
            if (contextValue !== undefined && contextValue === expectedValue) {
                matched++;
            }
        }
        if (completionCriteria.size === 0) {
            return objective.isComplete() ? 100 : objective.getProgress();
        }
        return Math.round((matched / completionCriteria.size) * 100);
    }
}
