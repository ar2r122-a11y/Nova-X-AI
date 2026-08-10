import { IQuery } from "@nova-x-ai/core";
import type { GetMemoriesForCharacterQuery as IGetMemoriesForCharacterQuery } from "../../Contracts/IMemoryEngine";

export class GetMemoriesForCharacterQuery implements IQuery, IGetMemoriesForCharacterQuery {
    constructor(
        public readonly ownerId: string,
        public readonly requesterId: string,
        public readonly limit: number,
        public readonly minSalience: number
    ) {}
}
