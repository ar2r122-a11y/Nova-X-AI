import { ContentSafetyRating } from "../ValueObjects/ContentSafetyRating";
import { ImageAsset } from "../Entities/ImageAsset";
import { SafetyCheckException } from "../Exceptions/SafetyCheckException";

export class ImageModerationService {
    public moderateContent(asset: ImageAsset): ContentSafetyRating {
        if (asset.safetyRating === ContentSafetyRating.UNSAFE) {
            throw new SafetyCheckException("Asset marked as unsafe.");
        }
        return asset.safetyRating;
    }

    public getSafetyRating(rating: ContentSafetyRating): ContentSafetyRating {
        return rating;
    }
}
