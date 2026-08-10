import { EmotionalStimulus } from "../ValueObjects/EmotionalStimulus";
import { MoodDescriptor } from "../ValueObjects/MoodDescriptor";

export class MoodInertiaPolicy {
    private static readonly CUMULATIVE_THRESHOLD = 0.6;

    static canTransition(
        _currentMood: MoodDescriptor,
        stimulus: EmotionalStimulus,
        sensitivity: number
    ): boolean {
        const cumulativeForce = Math.abs(stimulus.getValence()) * stimulus.getIntensity() * sensitivity;
        return cumulativeForce >= MoodInertiaPolicy.CUMULATIVE_THRESHOLD;
    }
}
