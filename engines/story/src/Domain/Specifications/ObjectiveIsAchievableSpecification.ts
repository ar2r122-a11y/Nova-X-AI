import { Objective } from "../Entities/Objective";

export class ObjectiveIsAchievableSpecification {
    static isSatisfiedBy(objective: Objective, flags: Map<string, unknown>): boolean {
        if (objective.isFailed()) {
            return false;
        }

        const requiredFlags = objective.getRequiredFlags();
        for (const [key, value] of requiredFlags.entries()) {
            const flagValue = flags.get(key);
            if (flagValue === undefined || flagValue !== value) {
                return false;
            }
        }

        return true;
    }
}
