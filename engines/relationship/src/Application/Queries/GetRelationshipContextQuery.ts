import { IQuery } from "@nova-x-ai/core";

export class GetRelationshipContextQuery implements IQuery {
    constructor(
        public readonly relationshipId: string,
        public readonly requesterId: string
    ) {}
}
