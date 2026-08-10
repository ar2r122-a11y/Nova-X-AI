
export class DialectNote {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(note: string): DialectNote {
        if (!note || note.trim().length === 0) {
            throw new Error("DialectNote cannot be empty.");
        }
        return new DialectNote(note);
    }

    public static fromString(value: string): DialectNote {
        return DialectNote.create(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: DialectNote): boolean {
        return this.value === other.value;
    }
}
