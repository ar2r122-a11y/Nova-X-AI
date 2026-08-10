import { IQuery } from "@nova-x-ai/core";

export class GetEmotionalStateQuery implements IQuery {
    constructor(
        public readonly characterId: string,
        public readonly requesterId: string
    ) {}
}
