import { IQuery } from "@nova-x-ai/core";

export class GetEmotionalHistoryQuery implements IQuery {
    constructor(
        public readonly characterId: string,
        public readonly requesterId: string,
        public readonly limit?: number
    ) {}
}
