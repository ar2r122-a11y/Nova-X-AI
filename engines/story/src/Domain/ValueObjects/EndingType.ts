export type EndingType = "good" | "bad" | "neutral" | "secret";

export class EndingTypeRef {
    private readonly value: EndingType;

    private constructor(value: EndingType) {
        this.value = value;
    }

    static create(value: string): EndingTypeRef {
        if (!EndingTypeRef.isValid(value)) {
            throw new Error(`Invalid EndingType: ${value}`);
        }
        return new EndingTypeRef(value as EndingType);
    }

    static initial(): EndingTypeRef {
        return EndingTypeRef.create("neutral");
    }

    static good(): EndingTypeRef {
        return EndingTypeRef.create("good");
    }

    static bad(): EndingTypeRef {
        return EndingTypeRef.create("bad");
    }

    static neutral(): EndingTypeRef {
        return EndingTypeRef.create("neutral");
    }

    static secret(): EndingTypeRef {
        return EndingTypeRef.create("secret");
    }

    getValue(): EndingType {
        return this.value;
    }

    equals(other: EndingTypeRef): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    private static readonly VALUES: EndingType[] = ["good", "bad", "neutral", "secret"];

    private static isValid(value: string): boolean {
        return EndingTypeRef.VALUES.includes(value as EndingType);
    }
}
