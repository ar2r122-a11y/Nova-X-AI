export class EmotionalStimulusDto {
    constructor(
        public readonly sourceId: string,
        public readonly stimulusType: string,
        public readonly intensity: number,
        public readonly valence: number,
        public readonly associatedMemoryId?: string
    ) {}
}
