import { IQuery } from "@nova-x-ai/core";
import type { GetMemoryContextQuery as IGetMemoryContextQuery } from "../../Contracts/IMemoryEngine";

export class GetMemoryContextQuery implements IQuery, IGetMemoryContextQuery {
    constructor(
        public readonly ownerId: string,
        public readonly contextTokenLimit: number,
        public readonly memoryTypes: string[],
        public readonly requesterId: string
    ) {}
}
