export class GenerationOptionsDto {
    constructor(
        public readonly width: number,
        public readonly height: number,
        public readonly steps: number,
        public readonly cfgScale: number,
        public readonly seed: number | null,
        public readonly thumbnailSizes: string[]
    ) {}
}
