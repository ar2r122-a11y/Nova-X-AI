import { IQuery } from "@nova-x-ai/core";

export class GetNpcPresenceQuery implements IQuery {
    constructor(
        public readonly worldId: string,
        public readonly locationId: string,
        public readonly timestamp?: number,
        public readonly requesterId?: string
    ) {}
}
