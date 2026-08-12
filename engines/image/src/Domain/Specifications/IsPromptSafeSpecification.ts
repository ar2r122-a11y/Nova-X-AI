
import { ContentSafetyRating } from "../ValueObjects/ContentSafetyRating";
import { SafetyViolationException } from "../Exceptions/SafetyViolationException";

export class IsPromptSafeSpecification {
    private readonly blockedTerms: string[];

    constructor(blockedTerms: string[]) {
        this.blockedTerms = blockedTerms;
    }

    public isSatisfiedBy(prompt: string, rating: ContentSafetyRating): boolean {
        if (rating === ContentSafetyRating.UNSAFE) {
            throw new SafetyViolationException(`Unsafe rating for prompt: ${prompt}`);
        }
        const lowerPrompt = prompt.toLowerCase();
        for (const term of this.blockedTerms) {
            if (lowerPrompt.includes(term.toLowerCase())) {
                throw new SafetyViolationException(`Blocked term detected: ${term}`);
            }
        }
        return true;
    }
}
