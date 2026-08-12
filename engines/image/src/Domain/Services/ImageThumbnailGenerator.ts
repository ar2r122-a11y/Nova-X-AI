import { ImageDimensions } from "../ValueObjects/ImageDimensions";
import { ThumbnailSize } from "../ValueObjects/ThumbnailSize";

export class ImageThumbnailGenerator {
    public generateThumbnails(dimensions: ImageDimensions): Array<{ size: ThumbnailSize; width: number; height: number }> {
        const results: Array<{ size: ThumbnailSize; width: number; height: number }> = [];
        const aspectRatio = dimensions.getWidth() / dimensions.getHeight();

        results.push({ size: ThumbnailSize.SIZE_128, width: 128, height: Math.floor(128 / aspectRatio) });
        results.push({ size: ThumbnailSize.SIZE_256, width: 256, height: Math.floor(256 / aspectRatio) });
        results.push({ size: ThumbnailSize.SIZE_512, width: 512, height: Math.floor(512 / aspectRatio) });

        return results;
    }

    public getThumbnailSizes(): ThumbnailSize[] {
        return [ThumbnailSize.SIZE_128, ThumbnailSize.SIZE_256, ThumbnailSize.SIZE_512];
    }
}
