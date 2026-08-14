import type { IAgeControlEnforcer } from "../../Contracts";
import type { AgeControl } from "../../Domain/Entities";

const AGE_RATING_HIERARCHY: Record<string, number> = {
    child: 1,
    teen: 2,
    adult: 3,
    unrestricted: 4,
    educational: 0,
    cartoon: 0,
    mild_fantasy: 1,
    mild_adventure: 1,
    moderate_fantasy: 2,
    mature_themes: 3,
    mild_violence: 2,
    scary: 1,
    violence: 3
};

const DEFAULT_ALLOWED_BY_RATING: Record<string, string[]> = {
    child: ["educational", "cartoon", "mild_fantasy"],
    teen: ["educational", "cartoon", "mild_fantasy", "mild_adventure", "moderate_fantasy"],
    adult: ["educational", "cartoon", "mild_fantasy", "mild_adventure", "moderate_fantasy", "mature_themes", "mild_violence"],
    unrestricted: ["*"]
};

export class AgeControlEnforcer implements IAgeControlEnforcer {
    enforce(control: AgeControl, contentRating: string): { allowed: boolean; reason?: string } {
        const userLevel = AGE_RATING_HIERARCHY[control.ageRating] ?? 0;
        const contentLevel = AGE_RATING_HIERARCHY[contentRating] ?? 0;

        if (contentLevel > userLevel) {
            return {
                allowed: false,
                reason: `Content rating "${contentRating}" exceeds user age group "${control.ageRating}"`
            };
        }

        if (control.blockedContentTypes.includes("*") || control.blockedContentTypes.includes(contentRating)) {
            return {
                allowed: false,
                reason: `Content type "${contentRating}" is blocked for age group "${control.ageRating}"`
            };
        }

        if (control.allowedContentTypes.length > 0 && !control.allowedContentTypes.includes(contentRating) && !control.allowedContentTypes.includes("*")) {
            return {
                allowed: false,
                reason: `Content type "${contentRating}" is not allowed for age group "${control.ageRating}"`
            };
        }

        return { allowed: true };
    }
}
