import { ICommand } from "@nova-x-ai/core";

export class ProcessEmotionalStimulusCommand implements ICommand {
    constructor(
        public readonly characterId: string,
        public readonly stimulus: {
            sourceId: string;
            stimulusType: string;
            intensity: number;
            valence: number;
            associatedMemoryId?: string;
        },
        public readonly sensitivity: number
    ) {}
}
