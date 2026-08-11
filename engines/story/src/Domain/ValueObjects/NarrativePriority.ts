export type NarrativePriority = "low" | "normal" | "high" | "critical";

export class NarrativePriorityRef {
    private readonly value: NarrativePriority;

    private constructor(value: NarrativePriority) {
        this.value = value;
    }

    static create(value: string): NarrativePriorityRef {
        if (!NarrativePriorityRef.isValid(value)) {
            throw new Error(`Invalid NarrativePriority: ${value}`);
        }
        return new NarrativePriorityRef(value as NarrativePriority);
    }

    static initial(): NarrativePriorityRef {
        return NarrativePriorityRef.create("normal");
    }

    static low(): NarrativePriorityRef {
        return NarrativePriorityRef.create("low");
    }

    static normal(): NarrativePriorityRef {
        return NarrativePriorityRef.create("normal");
    }

    static high(): NarrativePriorityRef {
        return NarrativePriorityRef.create("high");
    }

    static critical(): NarrativePriorityRef {
        return NarrativePriorityRef.create("critical");
    }

    getValue(): NarrativePriority {
        return this.value;
    }

    equals(other: NarrativePriorityRef): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    private static readonly VALUES: NarrativePriority[] = ["low", "normal", "high", "critical"];

    private static isValid(value: string): boolean {
        return NarrativePriorityRef.VALUES.includes(value as NarrativePriority);
    }
}
