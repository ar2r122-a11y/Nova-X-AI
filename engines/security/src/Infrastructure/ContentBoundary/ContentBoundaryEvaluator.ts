import type { IContentBoundaryEvaluator } from "../../Contracts";
import type { ContentBoundary } from "../../Domain/Entities";

export class ContentBoundaryEvaluator implements IContentBoundaryEvaluator {
    evaluate(boundary: ContentBoundary, category: string): { allowed: boolean; reason?: string } {
        if (boundary.blockedCategories.includes(category)) {
            return {
                allowed: false,
                reason: `Content category "${category}" is blocked by boundary "${boundary.name}"`
            };
        }

        if (boundary.allowedCategories.length > 0 && !boundary.allowedCategories.includes(category)) {
            return {
                allowed: false,
                reason: `Content category "${category}" is not in allowed list for boundary "${boundary.name}"`
            };
        }

        return { allowed: true };
    }
}
