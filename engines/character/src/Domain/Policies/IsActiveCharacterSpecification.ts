
import { CharacterAggregate } from "../Aggregates";

export class IsActiveCharacterSpecification {
    public isSatisfiedBy(character: CharacterAggregate): boolean {
        const status = character.getState().status;
        return status.getValue() === "active" && status.getValue() !== "hibernating";
    }
}
