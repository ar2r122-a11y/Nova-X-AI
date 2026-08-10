import { ICommand } from "@nova-x-ai/core";
import type { ForgetMemoryCommand as IForgetMemoryCommand } from "../../Contracts/IMemoryEngine";

export class ForgetMemoryCommand implements ICommand, IForgetMemoryCommand {
    constructor(
        public readonly memoryId: string,
        public readonly ownerId: string,
        public readonly claims: { roles: string[]; permissions: string[] }
    ) {}
}
