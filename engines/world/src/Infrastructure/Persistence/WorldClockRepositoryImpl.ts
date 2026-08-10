import type { IStorageEngine } from "@nova-x-ai/storage";
import type { IWorldClockRepository } from "../../Domain/Repositories/IWorldClockRepository";
import { WorldClockAggregate } from "../../Domain/Aggregates/WorldClockAggregate";
import { WorldId } from "../../Domain/ValueObjects/WorldId";
import { TimeOfDay } from "../../Domain/ValueObjects/TimeOfDay";
import { CalendarDate } from "../../Domain/ValueObjects/CalendarDate";
import { SeasonRef } from "../../Domain/ValueObjects/Season";
import { WorldEventVersion } from "../../Domain/ValueObjects/WorldEventVersion";

interface StoredWorldClockEntity {
    id: string;
    data: string;
}

export class WorldClockRepositoryImpl implements IWorldClockRepository {
    private readonly storageRepository: {
        getById(key: string): Promise<StoredWorldClockEntity | null>;
        save(entity: StoredWorldClockEntity): Promise<void>;
        delete(key: string): Promise<void>;
        exists(key: string): Promise<boolean>;
        getAll(): Promise<StoredWorldClockEntity[]>;
    };

    constructor(storageEngine: IStorageEngine) {
        const repo = storageEngine.getRepository<StoredWorldClockEntity>("world-clocks");
        this.storageRepository = {
            getById: (key) => repo.getById(key),
            save: (entity) => repo.save(entity),
            delete: (key) => repo.delete(key),
            exists: (key) => repo.exists(key),
            getAll: () => repo.getAll()
        };
    }

    async findByWorldId(worldId: WorldId): Promise<WorldClockAggregate | null> {
        const entity = await this.storageRepository.getById(worldId.getValue());
        if (!entity) {
            return null;
        }
        const snapshot = JSON.parse(entity.data);
        return this.reconstitute(snapshot);
    }

    async save(aggregate: WorldClockAggregate): Promise<void> {
        const snapshot = aggregate.getSnapshot();
        const serialized = JSON.stringify(snapshot);
        const entity: StoredWorldClockEntity = {
            id: aggregate.getWorldId().getValue(),
            data: serialized
        };
        await this.storageRepository.save(entity);
    }

    private reconstitute(snapshot: any): WorldClockAggregate {
        const worldId = WorldId.fromString(snapshot.worldId);
        const timeOfDay = TimeOfDay.fromTotalSeconds(this.parseTimeString(snapshot.timeOfDay));
        const calendarDate = this.parseDateString(snapshot.calendarDate);
        const season = SeasonRef.create(snapshot.season);
        const tickCount = snapshot.tickCount;
        const version = WorldEventVersion.create(snapshot.version);
        return WorldClockAggregate.reconstitute(worldId, timeOfDay, calendarDate, season, tickCount, version);
    }

    private parseTimeString(timeStr: string): number {
        const [hours, minutes, seconds] = timeStr.split(":").map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    }

    private parseDateString(dateStr: string): CalendarDate {
        const [year, month, day] = dateStr.split("-").map(Number);
        return CalendarDate.create(year, month, day);
    }
}
