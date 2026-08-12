
import { ContentSafetyRating } from "../ValueObjects/ContentSafetyRating";
import { SafetyViolationException } from "../Exceptions/ImageExceptions";

export class SafetyContentModerationPolicy {
    private readonly blockedTags: string[];

    constructor(blockedTags: string[] = ["nsfw", "gore", "explicit"]) {
        this.blockedTags = blockedTags;
    }

    moderate(rating: ContentSafetyRating, tags: string[]): boolean {
        if (rating === ContentSafetyRating.UNSAFE) {
            throw new SafetyViolationException(`Content rating ${rating} is blocked.`);
        }
        const blocked = tags.filter(tag => this.blockedTags.includes(tag.toLowerCase()));
        if (blocked.length > 0) {
            throw new SafetyViolationException(`Blocked tags detected: ${blocked.join(", ")}.`);
        }
        return true;
    }

    getBlockedTags(): string[] {
        return this.blockedTags;
    }
}
