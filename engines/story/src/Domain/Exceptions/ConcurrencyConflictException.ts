export class ConcurrencyConflictException extends Error {
    constructor(expectedVersion: number, actualVersion: number, streamId: string) {
        super(`Concurrency conflict on stream ${streamId}: expected version ${expectedVersion}, actual ${actualVersion}`);
        this.name = "ConcurrencyConflictException";
    }
}
