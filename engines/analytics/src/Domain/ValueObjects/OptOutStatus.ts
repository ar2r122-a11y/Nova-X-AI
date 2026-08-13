export class OptOutStatus {
    private readonly optedOut: boolean;
    private readonly updatedAt: number;

    private constructor(optedOut: boolean, updatedAt: number) {
        this.optedOut = optedOut;
        this.updatedAt = updatedAt;
    }

    static create(optedOut: boolean): OptOutStatus {
        return new OptOutStatus(optedOut, Date.now());
    }

    static reconstitute(optedOut: boolean, updatedAt: number): OptOutStatus {
        return new OptOutStatus(optedOut, updatedAt);
    }

    isOptedOut(): boolean {
        return this.optedOut;
    }

    getUpdatedAt(): number {
        return this.updatedAt;
    }
}
