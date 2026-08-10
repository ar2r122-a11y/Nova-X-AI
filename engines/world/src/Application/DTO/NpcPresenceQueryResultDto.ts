export class NpcPresenceQueryResultDto {
    constructor(
        public readonly locationId: string,
        public readonly presentNpcs: string[],
        public readonly timestamp: number
    ) {}
}
