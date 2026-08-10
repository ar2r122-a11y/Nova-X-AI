export class CharacterStatePatchDto {
    constructor(
        public readonly status?: string,
        public readonly currentLocation?: string,
        public readonly energyLevel?: number
    ) {}
}
