export class CharacterPromptContextDto {
    constructor(
        public readonly characterId: string,
        public readonly identity: object,
        public readonly personality: object,
        public readonly recentMemories: string[],
        public readonly emotionalSnapshot: object,
        public readonly tokenCount: number,
        public readonly contextBlock: string
    ) {}
}
