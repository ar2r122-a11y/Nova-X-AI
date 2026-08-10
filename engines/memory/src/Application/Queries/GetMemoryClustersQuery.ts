import { IQuery } from "@nova-x-ai/core";
import type { GetMemoryClustersQuery as IGetMemoryClustersQuery } from "../../Contracts/IMemoryEngine";

export class GetMemoryClustersQuery implements IQuery, IGetMemoryClustersQuery {
    constructor(
        public readonly ownerId: string,
        public readonly requesterId: string
    ) {}
}
