
export class AccessControlToken {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(token: string): AccessControlToken {
        if (!token || token.trim().length === 0) {
            throw new Error("AccessControlToken cannot be empty.");
        }
        return new AccessControlToken(token);
    }

    public static fromString(value: string): AccessControlToken {
        return AccessControlToken.create(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: AccessControlToken): boolean {
        return this.value === other.value;
    }
}
