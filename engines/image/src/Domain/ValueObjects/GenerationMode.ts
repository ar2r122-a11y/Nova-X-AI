
export class GenerationMode {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string): GenerationMode {
        const valid = ["textToImage", "imageToImage", "inpainting", "outpainting", "upscaling", "variation"];
        if (!valid.includes(value)) {
            throw new Error(`Invalid GenerationMode: ${value}. Must be one of ${valid.join(", ")}.`);
        }
        return new GenerationMode(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: GenerationMode): boolean {
        return this.value === other.value;
    }
}
