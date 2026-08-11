export interface IResponseParser {
    parse(response: string, schema: object): Promise<Record<string, unknown>>;
    validateStructure(data: Record<string, unknown>, schema: object): boolean;
}

export class ResponseParser implements IResponseParser {
    async parse(response: string, schema: object): Promise<Record<string, unknown>> {
        const data = JSON.parse(response) as Record<string, unknown>;
        return data;
    }

    validateStructure(data: Record<string, unknown>, schema: object): boolean {
        const schemaObj = schema as { required?: string[]; properties?: Record<string, unknown> };
        const required = schemaObj.required ?? [];

        for (const field of required) {
            if (!(field in data)) {
                return false;
            }
        }

        return true;
    }
}
