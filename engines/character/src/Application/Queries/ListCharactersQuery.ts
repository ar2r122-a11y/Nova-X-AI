import { IQuery } from "@nova-x-ai/core";

export class ListCharactersQuery implements IQuery {
    constructor(
        public readonly ownerId?: string,
        public readonly status?: string,
        public readonly limit: number = 50
    ) {}
}
