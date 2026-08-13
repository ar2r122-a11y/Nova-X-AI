import { ICommand } from "@nova-x-ai/core";
import type { PurgeCommand as IPurgeCommand } from "../../Contracts/IAnalyticsEngine";

export class PurgeCommand implements ICommand, IPurgeCommand {
    constructor(
        public readonly olderThanDays: number,
        public readonly claims: { roles: string[]; permissions: string[] }
    ) {}
}
