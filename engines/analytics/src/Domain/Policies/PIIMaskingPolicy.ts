export class PIIMaskingPolicy {
    static readonly SENSITIVE_FIELDS = [
        "content",
        "prompt",
        "message",
        "userInput",
        "apiKey",
        "password",
        "token",
        "email",
        "ip",
        "address"
    ];

    static stripPII(payload: Record<string, unknown>): { sanitized: Record<string, unknown>; fieldsStripped: string[] } {
        const sanitized: Record<string, unknown> = {};
        const fieldsStripped: string[] = [];

        for (const [key, value] of Object.entries(payload)) {
            if (this.SENSITIVE_FIELDS.some((field) => field.toLowerCase() === key.toLowerCase())) {
                fieldsStripped.push(key);
                sanitized[key] = "[REDACTED]";
            } else if (typeof value === "string" && this.looksLikePII(value)) {
                fieldsStripped.push(key);
                sanitized[key] = this.hashValue(value);
            } else {
                sanitized[key] = value;
            }
        }

        return { sanitized, fieldsStripped };
    }

    static anonymizeIP(ip: string): string {
        const parts = ip.split(".");
        if (parts.length === 4) {
            return `${parts[0]}.${parts[1]}.*.*`;
        }
        return ip.replace(/[\d]{1,3}$/g, "*");
    }

    private static looksLikePII(value: string): boolean {
        return value.includes("@") || /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(value);
    }

    private static hashValue(value: string): string {
        let hash = 0;
        for (let i = 0; i < value.length; i++) {
            const char = value.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return `hashed-${Math.abs(hash).toString(16)}`;
    }
}
