import { IQuery } from "@nova-x-ai/core";

export class GetWorldStateQuery implements IQuery {
    constructor(
        public readonly worldId: string,
        public readonly requesterId?: string
    ) {}
}
