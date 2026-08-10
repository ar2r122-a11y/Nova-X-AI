export class MemoryNotFoundException extends Error {
    constructor(memoryId: string) {
        super(`Memory not found: ${memoryId}`);
        this.name = "MemoryNotFoundException";
    }
}

export class MemoryAuthorizationException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "MemoryAuthorizationException";
    }
}

export class InvalidMemoryImportanceException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidMemoryImportanceException";
    }
}

export class MemoryContentHashConflictException extends Error {
    constructor(contentHash: string) {
        super(`Memory with content hash already exists: ${contentHash}`);
        this.name = "MemoryContentHashConflictException";
    }
}
