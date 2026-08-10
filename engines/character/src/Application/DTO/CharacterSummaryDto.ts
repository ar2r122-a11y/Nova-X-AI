export class CharacterSummaryDto {
    constructor(
        public readonly characterId: string,
        public readonly name: string,
        public readonly title: string,
        public readonly status: string,
        public readonly evolutionStage: string,
        public readonly interactionCount: number,
        public readonly createdAt: number
    ) {}
}
