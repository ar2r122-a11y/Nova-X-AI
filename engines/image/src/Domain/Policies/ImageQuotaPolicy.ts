
export class ImageQuotaPolicy {
    private readonly maxImagesPerUser: number;
    private readonly maxConcurrentGenerations: number;

    constructor(maxImagesPerUser: number = 100, maxConcurrentGenerations: number = 5) {
        this.maxImagesPerUser = maxImagesPerUser;
        this.maxConcurrentGenerations = maxConcurrentGenerations;
    }

    public canCreateImage(_userId: string, currentCount: number, activeGenerations: number): boolean {
        return currentCount < this.maxImagesPerUser && activeGenerations < this.maxConcurrentGenerations;
    }

    public getMaxImagesPerUser(): number {
        return this.maxImagesPerUser;
    }

    public getMaxConcurrentGenerations(): number {
        return this.maxConcurrentGenerations;
    }
}
