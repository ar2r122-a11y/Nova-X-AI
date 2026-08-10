import { IQuery } from "@nova-x-ai/core";

export class ListRegionLocationsQuery implements IQuery {
    constructor(
        public readonly worldId: string,
        public readonly regionId: string,
        public readonly requesterId?: string
    ) {}
}
