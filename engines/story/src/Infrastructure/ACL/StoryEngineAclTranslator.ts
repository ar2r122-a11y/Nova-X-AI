export class StoryEngineAclTranslator {
    translateToCommand(payload: unknown, _version: string): unknown {
        if (!payload || typeof payload !== "object") {
            throw new Error("Invalid command payload.");
        }
        const data = payload as Record<string, unknown>;
        if (!data.commandType || typeof data.commandType !== "string") {
            throw new Error("Missing commandType in payload.");
        }
        return payload;
    }

    translateToQuery(payload: unknown, _version: string): unknown {
        if (!payload || typeof payload !== "object") {
            throw new Error("Invalid query payload.");
        }
        const data = payload as Record<string, unknown>;
        if (!data.queryType || typeof data.queryType !== "string") {
            throw new Error("Missing queryType in payload.");
        }
        return payload;
    }

    normalizeExternalError(error: unknown): Error {
        if (error instanceof Error) {
            return error;
        }
        return new Error(String(error));
    }

    validateExternalData(data: unknown, _schema: object): void {
        if (data === null || data === undefined) {
            throw new Error("External data is null or undefined.");
        }
        if (typeof data !== "object") {
            throw new Error("External data must be an object.");
        }
    }
}
