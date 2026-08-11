export class CommandResultDto {
    success: boolean;
    result?: unknown;
    error?: string;
    correlationId: string;

    constructor(success: boolean, correlationId: string, result?: unknown, error?: string) {
        this.success = success;
        this.correlationId = correlationId;
        this.result = result;
        this.error = error;
    }
}
