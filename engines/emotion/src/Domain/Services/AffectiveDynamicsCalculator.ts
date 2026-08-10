import { EmotionalDelta } from "../ValueObjects/EmotionalDelta";
import { EmotionalStimulus } from "../ValueObjects/EmotionalStimulus";
import { PADCoordinates } from "../ValueObjects/PADCoordinates";

export class AffectiveDynamicsCalculator {
    calculatePadShift(current: PADCoordinates, stimulus: EmotionalStimulus, sensitivity: number): PADCoordinates {
        const delta = EmotionalDelta.create(
            stimulus.getValence() * stimulus.getIntensity() * sensitivity,
            stimulus.getIntensity() * 0.5 * sensitivity,
            stimulus.getValence() * 0.2 * sensitivity
        );
        return current.add(delta);
    }

    calculateDecay(current: PADCoordinates, baseline: PADCoordinates, rate: number): PADCoordinates {
        const decayFactor = Math.exp(-rate);
        return current.interpolateToward(baseline, decayFactor);
    }
}
