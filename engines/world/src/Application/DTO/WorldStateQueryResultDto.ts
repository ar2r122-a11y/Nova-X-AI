export class WorldStateQueryResultDto {
    constructor(
        public readonly worldId: string,
        public readonly state: string,
        public readonly version: number,
        public readonly regionCount: number,
        public readonly globalVariableCount: number
    ) {}
}
