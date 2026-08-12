
import { ImageDimensions } from "../ValueObjects/ImageDimensions";

export class IsValidDimensionSpecification {
    private readonly minWidth: number;
    private readonly minHeight: number;
    private readonly maxWidth: number;
    private readonly maxHeight: number;

    constructor(minWidth: number, minHeight: number, maxWidth: number, maxHeight: number) {
        this.minWidth = minWidth;
        this.minHeight = minHeight;
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
    }

    public isSatisfiedBy(dimensions: ImageDimensions): boolean {
        const width = dimensions.getWidth();
        const height = dimensions.getHeight();
        return width >= this.minWidth && height >= this.minHeight && width <= this.maxWidth && height <= this.maxHeight;
    }
}
