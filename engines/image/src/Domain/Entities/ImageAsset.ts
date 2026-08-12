import { AssetId } from "../ValueObjects/AssetId";
import { ImageDimensions } from "../ValueObjects/ImageDimensions";
import { ImageFormat } from "../ValueObjects/ImageFormat";
import { ContentSafetyRating } from "../ValueObjects/ContentSafetyRating";
import { AssetProvenance } from "../ValueObjects/AssetProvenance";

export interface ImageAsset {
    readonly id: string;
    readonly assetId: AssetId;
    readonly imageId: string;
    readonly ownerId: string;
    readonly format: ImageFormat;
    readonly dimensions: ImageDimensions;
    readonly width: number;
    readonly height: number;
    readonly sizeBytes: number;
    readonly checksum: string;
    readonly uri: string;
    readonly mimeType: string;
    readonly createdAt: number;
    readonly finalizedAt: number | null;
    readonly completedAt: number | null;
    readonly isPrimary: boolean;
    readonly isCandidate: boolean;
    readonly isAvatar: boolean;
    readonly candidateId: string | null;
    readonly parentImageId: string | null;
    readonly mode: string;
    readonly aspectRatio: string;
    readonly status: string;
    readonly provenance: AssetProvenance;
    readonly safetyRating: ContentSafetyRating;
    readonly metadata: Record<string, unknown>;
}

export namespace ImageAsset {
    export function fromSnapshot(snapshot: Record<string, unknown>): ImageAsset {
        return {
            id: snapshot.id as string,
            assetId: snapshot.assetId as AssetId,
            imageId: snapshot.imageId as string,
            ownerId: snapshot.ownerId as string,
            format: snapshot.format as ImageFormat,
            dimensions: snapshot.dimensions as ImageDimensions,
            width: snapshot.width as number,
            height: snapshot.height as number,
            sizeBytes: snapshot.sizeBytes as number,
            checksum: snapshot.checksum as string,
            uri: snapshot.uri as string,
            mimeType: snapshot.mimeType as string,
            createdAt: snapshot.createdAt as number,
            finalizedAt: snapshot.finalizedAt as number | null,
            completedAt: snapshot.completedAt as number | null,
            isPrimary: snapshot.isPrimary as boolean,
            isCandidate: snapshot.isCandidate as boolean,
            isAvatar: snapshot.isAvatar as boolean,
            candidateId: snapshot.candidateId as string | null,
            parentImageId: snapshot.parentImageId as string | null,
            mode: snapshot.mode as string,
            aspectRatio: snapshot.aspectRatio as string,
            status: snapshot.status as string,
            provenance: snapshot.provenance as AssetProvenance,
            safetyRating: snapshot.safetyRating as ContentSafetyRating,
            metadata: (snapshot.metadata as Record<string, unknown>) || {}
        };
    }

    export function toSnapshot(asset: ImageAsset): Record<string, unknown> {
        return {
            id: asset.id,
            assetId: asset.assetId,
            imageId: asset.imageId,
            ownerId: asset.ownerId,
            format: asset.format,
            dimensions: asset.dimensions,
            width: asset.width,
            height: asset.height,
            sizeBytes: asset.sizeBytes,
            checksum: asset.checksum,
            uri: asset.uri,
            mimeType: asset.mimeType,
            createdAt: asset.createdAt,
            finalizedAt: asset.finalizedAt,
            completedAt: asset.completedAt,
            isPrimary: asset.isPrimary,
            isCandidate: asset.isCandidate,
            isAvatar: asset.isAvatar,
            candidateId: asset.candidateId,
            parentImageId: asset.parentImageId,
            mode: asset.mode,
            aspectRatio: asset.aspectRatio,
            status: asset.status,
            provenance: asset.provenance,
            safetyRating: asset.safetyRating,
            metadata: asset.metadata
        };
    }
}
