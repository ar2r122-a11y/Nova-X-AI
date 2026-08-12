import { ContentSafetyRating } from "../ValueObjects/ContentSafetyRating";

export interface ContentModerationState {
    readonly rating: ContentSafetyRating;
    readonly flags: string[];
    readonly reviewedAt: number | null;
    readonly reviewedBy: string | null;
    readonly action: "allow" | "review" | "block";
}
