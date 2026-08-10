export type EmotionalStimulusType =
    | "dialogue"
    | "world_event"
    | "memory_resonance"
    | "relationship_interaction"
    | "narrative_climax"
    | "internal"
    | "user_input";

export interface EmotionalStimulusProps {
    sourceId: string;
    stimulusType: EmotionalStimulusType;
    intensity: number;
    valence: number;
    associatedMemoryId?: string;
    context?: string;
}

export class EmotionalStimulus {
    private constructor(private readonly props: EmotionalStimulusProps) {}

    static create(props: EmotionalStimulusProps): EmotionalStimulus {
        if (!props.sourceId || props.sourceId.trim().length === 0) {
            throw new Error("EmotionalStimulus sourceId cannot be empty.");
        }
        if (typeof props.intensity !== "number" || props.intensity < 0.0 || props.intensity > 1.0) {
            throw new Error("EmotionalStimulus intensity must be between 0.0 and 1.0.");
        }
        if (typeof props.valence !== "number" || props.valence < -1.0 || props.valence > 1.0) {
            throw new Error("EmotionalStimulus valence must be between -1.0 and 1.0.");
        }
        return new EmotionalStimulus({
            sourceId: props.sourceId,
            stimulusType: props.stimulusType,
            intensity: props.intensity,
            valence: props.valence,
            associatedMemoryId: props.associatedMemoryId,
            context: props.context
        });
    }

    getSourceId(): string {
        return this.props.sourceId;
    }

    getStimulusType(): EmotionalStimulusType {
        return this.props.stimulusType;
    }

    getIntensity(): number {
        return this.props.intensity;
    }

    getValence(): number {
        return this.props.valence;
    }

    getAssociatedMemoryId(): string | undefined {
        return this.props.associatedMemoryId;
    }

    getContext(): string | undefined {
        return this.props.context;
    }

    toSnapshot(): EmotionalStimulusProps {
        return { ...this.props };
    }
}
