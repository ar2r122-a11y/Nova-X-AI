export class CanRetrySpecification {
    private readonly maxRetries: number;

    public constructor(maxRetries: number) {
        this.maxRetries = maxRetries;
    }

    public static isSatisfiedBy(currentRetryCount: number, maxRetries: number): boolean {
        return currentRetryCount < maxRetries;
    }

    public isSatisfied(currentRetryCount: number): boolean {
        return CanRetrySpecification.isSatisfiedBy(currentRetryCount, this.maxRetries);
    }
}
