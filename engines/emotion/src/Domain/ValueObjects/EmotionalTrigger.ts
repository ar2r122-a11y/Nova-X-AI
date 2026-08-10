export type EmotionalTriggerType = "keyword" | "topic" | "entity" | "memory";

export interface EmotionalTriggerProps {
    triggerId: string;
    triggerType: EmotionalTriggerType;
    pattern: string;
    pleasureDelta: number;
    arousalDelta: number;
    dominanceDelta: number;
    weight: number;
}

export class EmotionalTrigger {
    private constructor(private readonly props: EmotionalTriggerProps) {}

    static create(props: Omit<EmotionalTriggerProps, "triggerId"> & { triggerId?: string }): EmotionalTrigger {
        const triggerId = props.triggerId ?? `trigger-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
        return new EmotionalTrigger({
            triggerId,
            triggerType: props.triggerType,
            pattern: props.pattern,
            pleasureDelta: Math.max(-1.0, Math.min(1.0, props.pleasureDelta)),
            arousalDelta: Math.max(0.0, Math.min(1.0, props.arousalDelta)),
            dominanceDelta: Math.max(-1.0, Math.min(1.0, props.dominanceDelta)),
            weight: Math.max(0.0, Math.min(1.0, props.weight))
        });
    }

    getTriggerId(): string {
        return this.props.triggerId;
    }

    getTriggerType(): EmotionalTriggerType {
        return this.props.triggerType;
    }

    getPattern(): string {
        return this.props.pattern;
    }

    getPleasureDelta(): number {
        return this.props.pleasureDelta;
    }

    getArousalDelta(): number {
        return this.props.arousalDelta;
    }

    getDominanceDelta(): number {
        return this.props.dominanceDelta;
    }

    getWeight(): number {
        return this.props.weight;
    }

    matches(text: string): boolean {
        const lowerText = text.toLowerCase();
        const lowerPattern = this.props.pattern.toLowerCase();
        if (this.props.triggerType === "keyword" || this.props.triggerType === "entity") {
            return lowerText.includes(lowerPattern);
        }
        if (this.props.triggerType === "topic") {
            return lowerText.includes(lowerPattern);
        }
        return false;
    }

    toSnapshot(): EmotionalTriggerProps {
        return { ...this.props };
    }
}
