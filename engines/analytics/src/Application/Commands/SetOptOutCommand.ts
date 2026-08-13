import { ICommand } from "@nova-x-ai/core";
import type { SetOptOutCommand as ISetOptOutCommand } from "../../Contracts/IAnalyticsEngine";

export class SetOptOutCommand implements ICommand, ISetOptOutCommand {
    constructor(
        public readonly optedOut: boolean,
        public readonly claims: { roles: string[]; permissions: string[] }
    ) {}
}
