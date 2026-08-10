import type { PADCoordinates } from "../ValueObjects/PADCoordinates";
import type { EmotionalStimulus } from "../ValueObjects/EmotionalStimulus";

export interface IAffectiveCalculator {
    calculatePadShift(current: PADCoordinates, stimulus: EmotionalStimulus, sensitivity: number): PADCoordinates;
    calculateDecay(current: PADCoordinates, baseline: PADCoordinates, rate: number): PADCoordinates;
}
