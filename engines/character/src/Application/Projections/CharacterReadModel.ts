import { CharacterAggregate } from "../../Domain/Aggregates";

export class CharacterReadModel {
    constructor(
        public readonly characterId: string,
        public readonly name: string,
        public readonly title: string,
        public readonly status: string,
        public readonly evolutionStage: string,
        public readonly interactionCount: number,
        public readonly ownerId: string,
        public readonly createdAt: number,
        public readonly updatedAt: number
    ) {}

    static fromAggregate(aggregate: CharacterAggregate): CharacterReadModel {
        const identity = aggregate.getIdentity();
        const statistics = aggregate.getStatistics();
        const state = aggregate.getState();

        return new CharacterReadModel(
            identity.id.getValue(),
            identity.name,
            identity.title,
            state.status.getValue(),
            statistics.evolutionStage.getValue(),
            statistics.interactionCount,
            identity.id.getValue(),
            Date.now(),
            Date.now()
        );
    }
}
