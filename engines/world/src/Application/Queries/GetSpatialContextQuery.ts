import { IQuery } from "@nova-x-ai/core";

export class GetSpatialContextQuery implements IQuery {
    constructor(
        public readonly worldId: string,
        public readonly locationId: string,
        public readonly requesterId?: string
    ) {}
}
