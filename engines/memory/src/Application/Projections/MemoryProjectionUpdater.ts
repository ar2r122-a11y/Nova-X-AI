import { MemoryStoredEvent, MemoryForgottenEvent, MemoryConsolidatedEvent, MemoryClusterFormedEvent, MemoryDecayedEvent } from "../../Domain/Events";
import { MemoryRecordDto } from "../DTO/MemoryRecordDto";
import { MemoryReadModelImpl } from "./MemoryReadModelImpl";
import type { MemoryReadModel } from "./MemoryReadModel";
import { MemoryClusterDto } from "../DTO/MemoryClusterDto";

export class MemoryProjectionUpdater {
    private readonly readModel: MemoryReadModel;

    constructor(readModel: MemoryReadModel = new MemoryReadModelImpl()) {
        this.readModel = readModel;
    }

    handleStored(event: MemoryStoredEvent): void {
        const dto = new MemoryRecordDto(
            event.memoryId.getValue(),
            event.memoryType.getValue(),
            "",
            event.memoryType.getValue() === "semantic" ? 0.8 : event.memoryType.getValue() === "episodic" ? 0.7 : 0.3,
            event.ownerId,
            event.timestamp,
            event.timestamp,
            event.timestamp,
            0,
            "active",
            [],
            "",
            undefined,
            undefined,
            undefined
        );
        this.readModel.upsertMemory(dto);
    }

    handleForgotten(event: MemoryForgottenEvent): void {
        this.readModel.removeMemory(event.memoryId.getValue());
    }

    handleConsolidated(event: MemoryConsolidatedEvent): void {
        const clusterId = event.clusterId.getValue();
        const memberIds = [event.memoryId.getValue()];
        this.readModel.clusters.set(clusterId, new MemoryClusterDto(
            clusterId,
            memberIds,
            memberIds.length,
            event.timestamp,
            event.timestamp
        ));
    }

    handleClusterFormed(event: MemoryClusterFormedEvent): void {
        const clusterId = event.clusterId.getValue();
        this.readModel.clusters.set(clusterId, new MemoryClusterDto(
            clusterId,
            event.memberMemoryIds,
            event.memberMemoryIds.length,
            event.timestamp,
            event.timestamp
        ));
    }

    handleDecayed(event: MemoryDecayedEvent): void {
        const memory = this.readModel.memories.get(event.memoryId.getValue());
        if (memory) {
            this.readModel.upsertMemory({
                ...memory,
                salience: event.newSalience,
                updatedAt: event.timestamp
            });
        }
    }

    getReadModel(): MemoryReadModel {
        return this.readModel;
    }
}
