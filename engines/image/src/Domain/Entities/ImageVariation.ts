
import { ImageId } from "../ValueObjects/ImageId";
import { ImageDimensions } from "../ValueObjects/ImageDimensions";
import { ImageStyle } from "../ValueObjects/ImageStyle";
import { AssetId } from "../ValueObjects/AssetId";

export interface ImageVariation {
    readonly id: string;
    readonly variationId: string;
    readonly parentImageId: ImageId;
    readonly prompt: string;
    readonly dimensions: ImageDimensions;
    readonly style: ImageStyle;
    readonly createdAt: number;
    readonly assetId: AssetId;
}
