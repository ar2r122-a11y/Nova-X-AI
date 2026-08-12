export class VoiceProfileSummaryDto {
    constructor(
        public readonly profileId: string,
        public readonly characterId: string,
        public readonly voiceId: string,
        public readonly locale: string,
        public readonly speakingRate: number,
        public readonly configurationVersion: number
    ) {}
}
