import type { ISanitizer } from "../../Contracts";

export class PayloadSanitizer implements ISanitizer {
    private readonly injectionPatterns = [
        /<\s*script[^>]*>/gi,
        /<\s*\/\s*script\s*>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /{{.*?}}/g,
        /\$\{.*?\}/g
    ];

    async sanitize(payload: unknown, resource: string): Promise<{ sanitized: unknown; threatsRemoved: number }> {
        if (typeof payload !== "string") {
            return { sanitized: payload, threatsRemoved: 0 };
        }

        let sanitized = payload;
        let threatsRemoved = 0;

        for (const pattern of this.injectionPatterns) {
            const matches = sanitized.match(pattern);
            if (matches) {
                threatsRemoved += matches.length;
                sanitized = sanitized.replace(pattern, "");
            }
        }

        return { sanitized, threatsRemoved };
    }
}
