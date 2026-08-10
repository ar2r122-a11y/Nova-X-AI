import { ICommand } from "@nova-x-ai/core";

export class RegisterNpcPresenceCommand implements ICommand {
    constructor(
        public readonly worldId: string,
        public readonly characterId: string,
        public readonly locationId: string,
        public readonly action: "arrived" | "departed",
        public readonly claims: { roles: string[]; permissions: string[] }
    ) {}
}
