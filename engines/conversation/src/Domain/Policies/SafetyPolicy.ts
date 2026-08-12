export class SafetyPolicy {
    private static readonly prohibitedPatterns = [
        /<script\b[^>]*>/i,
        /javascript:/i,
        /on\w+\s*=/i,
    ];

    public static sanitizeInput(input: string): string {
        let sanitized = input;
        for (const pattern of this.prohibitedPatterns) {
            sanitized = sanitized.replace(pattern, "");
        }
        return sanitized;
    }

    public static sanitizeOutput(output: string): string {
        let sanitized = output;
        for (const pattern of this.prohibitedPatterns) {
            sanitized = sanitized.replace(pattern, "");
        }
        return sanitized;
    }

    public static isSafe(input: string): boolean {
        return !this.prohibitedPatterns.some(pattern => pattern.test(input));
    }
}
