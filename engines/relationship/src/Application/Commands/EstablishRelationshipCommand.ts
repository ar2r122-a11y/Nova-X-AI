import { ICommand } from "@nova-x-ai/core";
import { BondType } from "../../Domain/ValueObjects/BondType";

export class EstablishRelationshipCommand implements ICommand {
    constructor(
        public readonly relationshipId: string,
        public readonly sourceEntityId: string,
        public readonly targetEntityId: string,
        public readonly bondType: BondType
    ) {}
}
