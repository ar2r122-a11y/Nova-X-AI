export interface EmotionalHistoryEntryProps {
    ledgerId: string;
    timestamp: number;
    previousPrimaryEmotion: string;
    newPrimaryEmotion: string;
    previousPrimaryMood: string;
    newPrimaryMood: string;
    previousPAD: { pleasure: number; arousal: number; dominance: number };
    newPAD: { pleasure: number; arousal: number; dominance: number };
    previousIntensity: number;
    newIntensity: number;
    previousStabilityIndex: number;
    newStabilityIndex: number;
    stimulusType?: string;
    stimulusIntensity?: number;
    stimulusValence?: number;
}

export class EmotionalHistoryEntry {
    private readonly props: EmotionalHistoryEntryProps;

    private constructor(props: EmotionalHistoryEntryProps) {
        this.props = props;
    }

    static create(props: Omit<EmotionalHistoryEntryProps, "ledgerId" | "timestamp"> & Partial<Pick<EmotionalHistoryEntryProps, "ledgerId" | "timestamp">>): EmotionalHistoryEntry {
        return new EmotionalHistoryEntry({
            ...props,
            ledgerId: props.ledgerId ?? `ledger-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
            timestamp: props.timestamp ?? Date.now()
        });
    }

    static reconstitute(props: EmotionalHistoryEntryProps): EmotionalHistoryEntry {
        return new EmotionalHistoryEntry(props);
    }

    getLedgerId(): string {
        return this.props.ledgerId;
    }

    getTimestamp(): number {
        return this.props.timestamp;
    }

    getPreviousPrimaryEmotion(): string {
        return this.props.previousPrimaryEmotion;
    }

    getNewPrimaryEmotion(): string {
        return this.props.newPrimaryEmotion;
    }

    getPreviousPrimaryMood(): string {
        return this.props.previousPrimaryMood;
    }

    getNewPrimaryMood(): string {
        return this.props.newPrimaryMood;
    }

    getPreviousPAD(): { pleasure: number; arousal: number; dominance: number } {
        return { ...this.props.previousPAD };
    }

    getNewPAD(): { pleasure: number; arousal: number; dominance: number } {
        return { ...this.props.newPAD };
    }

    getPreviousIntensity(): number {
        return this.props.previousIntensity;
    }

    getNewIntensity(): number {
        return this.props.newIntensity;
    }

    getPreviousStabilityIndex(): number {
        return this.props.previousStabilityIndex;
    }

    getNewStabilityIndex(): number {
        return this.props.newStabilityIndex;
    }

    getStimulusType(): string | undefined {
        return this.props.stimulusType;
    }

    getStimulusIntensity(): number | undefined {
        return this.props.stimulusIntensity;
    }

    getStimulusValence(): number | undefined {
        return this.props.stimulusValence;
    }

    toSnapshot(): EmotionalHistoryEntryProps {
        return { ...this.props };
    }
}
