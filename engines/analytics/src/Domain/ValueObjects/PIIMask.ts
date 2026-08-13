export class PIIMask {
    private readonly masked: boolean;
    private readonly originalLength: number;

    private constructor(masked: boolean, originalLength: number) {
        this.masked = masked;
        this.originalLength = originalLength;
    }

    static create(originalLength: number): PIIMask {
        return new PIIMask(true, originalLength);
    }

    static none(): PIIMask {
        return new PIIMask(false, 0);
    }

    isMasked(): boolean {
        return this.masked;
    }

    getOriginalLength(): number {
        return this.originalLength;
    }
}
