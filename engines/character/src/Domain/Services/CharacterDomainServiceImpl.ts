
import { ICharacterDomainService } from "./ICharacterDomainService";
import { CharacterStatus } from "../ValueObjects";
import { CharacterPersonality, CharacterRoutine } from "../Entities";
import { CharacterAggregate } from "../Aggregates";
import { EmotionalStateRef, CapabilityAction } from "../ValueObjects";

export class CharacterDomainServiceImpl implements ICharacterDomainService {
    public validateStateTransition(current: CharacterStatus, target: CharacterStatus): boolean {
        const currentVal = current.getValue();
        const targetVal = target.getValue();

        const validTransitions: Record<string, string[]> = {
            active: ["sleeping", "traveling", "incapacitated", "hibernating"],
            sleeping: ["active"],
            incapacitated: ["active", "hibernating"],
            traveling: ["active", "sleeping"],
            hibernating: ["active", "incapacitated"],
            unloaded: ["initializing"],
            initializing: ["active", "unloaded"]
        };

        const allowedTargets = validTransitions[currentVal] || [];
        return allowedTargets.includes(targetVal);
    }

    public calculateEmotionalImpact(event: string, personality: CharacterPersonality): { emotion: EmotionalStateRef; arousal: number } {
        let emotionScore = 0.5;
        const traits = Array.from(personality.traits.values());

        traits.forEach((trait) => {
            const score = trait.getValue().score;
            if (trait.getValue().name === "optimism") {
                emotionScore += score * 0.2;
            } else if (trait.getValue().name === "anxiety") {
                emotionScore -= score * 0.2;
            }
        });

        emotionScore = Math.max(0.0, Math.min(1.0, emotionScore));

        const emotion = event.includes("positive") || event.includes("success")
            ? EmotionalStateRef.create("joy")
            : event.includes("negative") || event.includes("failure")
                ? EmotionalStateRef.create("sadness")
                : EmotionalStateRef.create("neutral");

        const arousal = event.includes("intense") || event.includes("shock")
            ? Math.min(1.0, emotionScore + 0.3)
            : emotionScore;

        return { emotion, arousal };
    }

    public evaluateRoutine(routine: CharacterRoutine, worldTime: string): string {
        const currentHour = this.extractHour(worldTime);
        const matchingSchedule = routine.schedule.find((s: { timeBlock: string; activity: string }) => {
            const [start, end] = s.timeBlock.split("-");
            const startHour = this.extractHour(start);
            const endHour = this.extractHour(end);
            return currentHour >= startHour && currentHour <= endHour;
        });

        if (matchingSchedule) {
            return matchingSchedule.activity;
        }

        return routine.fallbackBehavior;
    }

    public assessCapabilities(character: CharacterAggregate, action: CapabilityAction): boolean {
        const allowedActions = character.getCapabilities().allowedActions;
        const toolAccess = character.getCapabilities().toolAccess;

        const isActionAllowed = allowedActions.some((a) => a.getValue() === action.getValue());
        const hasToolAccess = toolAccess.getValue() !== "none";

        return isActionAllowed && hasToolAccess;
    }

    private extractHour(timeStr: string): number {
        const parts = timeStr.split(":");
        return parseInt(parts[0] || "0", 10);
    }
}
