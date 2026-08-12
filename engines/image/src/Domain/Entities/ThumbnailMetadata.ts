import { AssetId } from "../ValueObjects/AssetId";
import { ThumbnailSize } from "../ValueObjects/ThumbnailSize";
import { ImageFormat } from "../ValueObjects/ImageFormat";

export interface ThumbnailMetadata {
    readonly id: string;
    readonly thumbnailId: string;
    readonly assetId: AssetId;
    readonly size: ThumbnailSize;
    readonly width: number;
    readonly height: number;
    readonly format: ImageFormat;
    readonly path: string;
    readonly createdAt: number;
}
