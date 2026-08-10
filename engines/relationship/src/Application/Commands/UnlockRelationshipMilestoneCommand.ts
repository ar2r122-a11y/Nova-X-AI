import { ICommand } from "@nova-x-ai/core";

export class UnlockRelationshipMilestoneCommand implements ICommand {
    constructor(
        public readonly relationshipId: string,
        public readonly milestoneId: string,
        public readonly name: string,
        public readonly description: string,
        public readonly requiredTrust: number,
        public readonly requiredAffinity: number,
        public readonly requiredRespect: number,
        public readonly requiredLoyalty: number,
        public readonly requiredBondType: string
    ) {}
}
