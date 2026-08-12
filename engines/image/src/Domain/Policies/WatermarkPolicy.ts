
import { ImageFormat } from "../ValueObjects/ImageFormat";

export class WatermarkPolicy {
    private readonly requiredFormats: ImageFormat[];

    constructor(requiredFormats: ImageFormat[] = [ImageFormat.PNG, ImageFormat.JPEG, ImageFormat.WEBP]) {
        this.requiredFormats = requiredFormats;
    }

    requiresWatermark(format: ImageFormat): boolean {
        return this.requiredFormats.includes(format);
    }

    getRequiredFormats(): ImageFormat[] {
        return this.requiredFormats;
    }
}
