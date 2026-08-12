
import { ImageDimensions } from "../ValueObjects/ImageDimensions";

export class CandidateGenerationPolicy {
    private readonly minDimensions: ImageDimensions;
    private readonly maxDimensions: ImageDimensions;
    private readonly maxCandidates: number;

    constructor(
        minDimensions: ImageDimensions = ImageDimensions.create(64, 64),
        maxDimensions: ImageDimensions = ImageDimensions.create(8192, 8192),
        maxCandidates: number = 16
    ) {
        this.minDimensions = minDimensions;
        this.maxDimensions = maxDimensions;
        this.maxCandidates = maxCandidates;
    }

    isValidDimension(dimensions: ImageDimensions): boolean {
        return (
            dimensions.getWidth() >= this.minDimensions.getWidth() &&
            dimensions.getHeight() >= this.minDimensions.getHeight() &&
            dimensions.getWidth() <= this.maxDimensions.getWidth() &&
            dimensions.getHeight() <= this.maxDimensions.getHeight()
        );
    }

    canGenerateMore(currentCount: number): boolean {
        return currentCount < this.maxCandidates;
    }

    getMaxCandidates(): number {
        return this.maxCandidates;
    }
}
