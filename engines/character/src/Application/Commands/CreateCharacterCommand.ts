import { ICommand } from "@nova-x-ai/core";

export class CreateCharacterCommand implements ICommand {
    constructor(
        public readonly name: string,
        public readonly title: string,
        public readonly biography: string,
        public readonly tagline: string,
        public readonly occupation: string,
        public readonly traits: Array<{ name: string; score: number }>,
        public readonly ownerId: string,
        public readonly claims: { roles: string[]; permissions: string[] }
    ) {}
}
