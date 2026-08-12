export class MultiParticipantPolicy {
    private readonly maxParticipants: number;
    private readonly allowConcurrentSpeech: boolean;

    public constructor(maxParticipants: number = 10, allowConcurrentSpeech: boolean = false) {
        this.maxParticipants = maxParticipants;
        this.allowConcurrentSpeech = allowConcurrentSpeech;
    }

    public canAddParticipant(currentCount: number): boolean {
        return currentCount < this.maxParticipants;
    }

    public canSpeakConcurrently(speakingCount: number): boolean {
        if (this.allowConcurrentSpeech) {
            return true;
        }
        return speakingCount === 0;
    }

    public getMaxParticipants(): number {
        return this.maxParticipants;
    }
}
