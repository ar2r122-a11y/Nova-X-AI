export interface EmotionalReactionProps {
    expressionStyle: string;
    verbalToneAdjustment: string;
    physicalDemeanor: string;
    intensityMultiplier: number;
}

export class EmotionalReaction {
    private constructor(private readonly props: EmotionalReactionProps) {}

    static create(props: EmotionalReactionProps): EmotionalReaction {
        return new EmotionalReaction({
            expressionStyle: props.expressionStyle,
            verbalToneAdjustment: props.verbalToneAdjustment,
            physicalDemeanor: props.physicalDemeanor,
            intensityMultiplier: Math.max(0.1, Math.min(2.0, props.intensityMultiplier))
        });
    }

    static neutral(): EmotionalReaction {
        return new EmotionalReaction({
            expressionStyle: "neutral",
            verbalToneAdjustment: "default",
            physicalDemeanor: "relaxed",
            intensityMultiplier: 1.0
        });
    }

    getExpressionStyle(): string {
        return this.props.expressionStyle;
    }

    getVerbalToneAdjustment(): string {
        return this.props.verbalToneAdjustment;
    }

    getPhysicalDemeanor(): string {
        return this.props.physicalDemeanor;
    }

    getIntensityMultiplier(): number {
        return this.props.intensityMultiplier;
    }

    toSnapshot(): EmotionalReactionProps {
        return { ...this.props };
    }
}
