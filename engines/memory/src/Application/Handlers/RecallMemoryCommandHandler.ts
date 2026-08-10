import { RecallMemoryCommand } from "../Commands/RecallMemoryCommand";
import { MemoryRetrievalResultDto } from "../DTO/MemoryRetrievalResultDto";
import { MemoryAuthorizationPolicy } from "../../Domain/Policies";
import type { IMemoryRepository } from "../../Domain/Repositories/IMemoryRepository";
import { MemoryRecordDto } from "../DTO/MemoryRecordDto";

export class RecallMemoryCommandHandler {
    constructor(
        private readonly repository: IMemoryRepository
    ) {}

    async handle(command: RecallMemoryCommand): Promise<MemoryRetrievalResultDto[]> {
        if (!MemoryAuthorizationPolicy.canRecall(command.requesterId, command.ownerId, [])) {
            throw new Error("Unauthorized: requester cannot recall memories for this owner.");
        }

        const allMemories = await this.repository.getByOwnerId(command.ownerId);
        const activeMemories = allMemories.filter((m) => m.getState().isActive());

        let filtered = activeMemories;
        if (command.memoryTypes.length > 0) {
            filtered = filtered.filter((m) => command.memoryTypes.includes(m.getType().getValue()));
        }

        const scored = filtered
            .map((m) => ({
                memory: m,
                score: m.getSalience().getValue()
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, command.limit);

        return scored.map((item, index) => {
            return new MemoryRetrievalResultDto(
                MemoryRecordDto.fromEntity(item.memory),
                item.score,
                index + 1
            );
        });
    }
}
