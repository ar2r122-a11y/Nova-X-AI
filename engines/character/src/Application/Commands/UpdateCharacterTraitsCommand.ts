import { ICommand } from "@nova-x-ai/core";

export class UpdateCharacterTraitsCommand implements ICommand {
    constructor(
        public readonly characterId: string,
        public readonly traits: Array<{ name: string; score: number }>,
        public readonly requesterId: string,
        public readonly claims: { roles: string[]; permissions: string[] }
    ) {}
}
