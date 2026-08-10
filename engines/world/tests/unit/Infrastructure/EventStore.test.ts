import { describe, it, expect, vi, beforeEach } from "vitest";
import { WorldEventStore } from "../../../src/Infrastructure/EventStore/WorldEventStore";
import { WorldEventSerialization } from "../../../src/Infrastructure/EventStore/WorldEventSerialization";
import { WorldEventUpcaster } from "../../../src/Infrastructure/EventStore/WorldEventUpcaster";

describe("WorldEventSerialization", () => {
    it("test_serialize_creates_correct_structure", () => {
        const event = {
            streamId: "world-1",
            version: 1,
            eventType: "EVT_WORLD_Test",
            payload: { key: "value" },
            timestamp: 1000,
            correlationId: "corr-1",
            causationId: "caus-1",
            metadata: { source: "test" },
            schemaVersion: 1
        };
        const serialized = WorldEventSerialization.serialize(event);
        expect(serialized).toEqual(event);
    });

    it("test_deserialize_parses_valid_data", () => {
        const data = {
            streamId: "world-1",
            version: 1,
            eventType: "EVT_WORLD_Test",
            payload: { key: "value" },
            timestamp: 1000,
            correlationId: "corr-1",
            causationId: "caus-1",
            metadata: { source: "test" },
            schemaVersion: 1
        };
        const result = WorldEventSerialization.deserialize(data);
        expect(result.streamId).toBe("world-1");
        expect(result.version).toBe(1);
        expect(result.eventType).toBe("EVT_WORLD_Test");
        expect(result.payload).toEqual({ key: "value" });
    });

    it("test_deserialize_handles_invalid_data", () => {
        expect(() => WorldEventSerialization.deserialize(null)).toThrow();
        expect(() => WorldEventSerialization.deserialize("invalid")).toThrow();
    });

    it("test_compute_checksum_returns_consistent_hash", () => {
        const data = { streamId: "world-1", version: 1 };
        const hash1 = WorldEventSerialization.computeChecksum(data);
        const hash2 = WorldEventSerialization.computeChecksum(data);
        expect(hash1).toBe(hash2);
        expect(hash1).toMatch(/^sha256-[a-f0-9]+$/);
    });
});

describe("WorldEventUpcaster", () => {
    it("test_upcast_passes_through_unregistered_events", () => {
        const upcaster = new WorldEventUpcaster();
        const events = [
            {
                eventId: "1",
                streamId: "world-1",
                eventType: "EVT_WORLD_Test",
                data: { streamId: "world-1", version: 1, eventType: "EVT_WORLD_Test", payload: { key: "value" } },
                version: 1,
                timestamp: 1000,
                correlationId: "corr-1",
                checksum: "sha256-abc"
            }
        ];
        const result = upcaster.upcast(events);
        expect(result).toHaveLength(1);
        expect(result[0].eventType).toBe("EVT_WORLD_Test");
    });

    it("test_upcast_applies_registered_upcaster", () => {
        const upcaster = new WorldEventUpcaster();
        upcaster.registerUpcaster("EVT_WORLD_Test", (payload) => ({
            ...payload,
            upcasted: true
        }));
        const events = [
            {
                eventId: "1",
                streamId: "world-1",
                eventType: "EVT_WORLD_Test",
                data: { streamId: "world-1", version: 1, eventType: "EVT_WORLD_Test", payload: { key: "value" } },
                version: 1,
                timestamp: 1000,
                correlationId: "corr-1",
                checksum: "sha256-abc"
            }
        ];
        const result = upcaster.upcast(events);
        expect(result[0].payload).toEqual({ key: "value", upcasted: true });
    });
});

describe("WorldEventStore", () => {
    let mockEventStore: any;
    let worldEventStore: WorldEventStore;

    beforeEach(() => {
        mockEventStore = {
            appendToStream: vi.fn(),
            readStream: vi.fn(),
            readAllStreams: vi.fn(),
            getStreamVersion: vi.fn(),
            subscribeToStream: vi.fn()
        };
        worldEventStore = new WorldEventStore(mockEventStore);
    });

    it("test_append_creates_storage_event_with_correct_version", async () => {
        mockEventStore.getStreamVersion.mockResolvedValue(0);
        mockEventStore.appendToStream.mockResolvedValue(undefined);

        await worldEventStore.append("world-1", "EVT_WORLD_Test", { key: "value" }, {
            correlationId: "corr-1",
            causationId: "caus-1",
            metadata: { source: "test" }
        });

        expect(mockEventStore.appendToStream).toHaveBeenCalledWith(
            "world-1",
            expect.arrayContaining([
                expect.objectContaining({
                    streamId: "world-1",
                    eventType: "EVT_WORLD_Test",
                    version: 1
                })
            ]),
            0
        );
    });

    it("test_readStream_returns_upcasted_events", async () => {
        mockEventStore.readStream.mockResolvedValue([
            {
                eventId: "1",
                streamId: "world-1",
                eventType: "EVT_WORLD_Test",
                data: { streamId: "world-1", version: 1, eventType: "EVT_WORLD_Test", payload: { key: "value" } },
                version: 1,
                timestamp: 1000,
                correlationId: "corr-1",
                checksum: "sha256-abc"
            }
        ]);

        const result = await worldEventStore.readStream("world-1", 0);
        expect(result).toHaveLength(1);
        expect(result[0].streamId).toBe("world-1");
        expect(result[0].version).toBe(1);
    });

    it("test_getStreamVersion_returns_current_version", async () => {
        mockEventStore.getStreamVersion.mockResolvedValue(5);
        const version = await worldEventStore.getStreamVersion("world-1");
        expect(version).toBe(5);
    });

    it("test_readStreamUpToVersion_filters_correctly", async () => {
        mockEventStore.readStream.mockResolvedValue([
            {
                eventId: "1",
                streamId: "world-1",
                eventType: "EVT_WORLD_Test",
                data: { streamId: "world-1", version: 1, eventType: "EVT_WORLD_Test", payload: {} },
                version: 1,
                timestamp: 1000,
                correlationId: "corr-1",
                checksum: "sha256-abc"
            },
            {
                eventId: "2",
                streamId: "world-1",
                eventType: "EVT_WORLD_Test",
                data: { streamId: "world-1", version: 2, eventType: "EVT_WORLD_Test", payload: {} },
                version: 2,
                timestamp: 1000,
                correlationId: "corr-1",
                checksum: "sha256-abc"
            }
        ]);

        const result = await worldEventStore.readStreamUpToVersion("world-1", 1);
        expect(result).toHaveLength(1);
        expect(result[0].version).toBe(1);
    });

    it("test_getStreamEvents_returns_all_events", async () => {
        mockEventStore.readStream.mockResolvedValue([
            {
                eventId: "1",
                streamId: "world-1",
                eventType: "EVT_WORLD_Test",
                data: { streamId: "world-1", version: 1, eventType: "EVT_WORLD_Test", payload: {} },
                version: 1,
                timestamp: 1000,
                correlationId: "corr-1",
                checksum: "sha256-abc"
            }
        ]);

        const result = await worldEventStore.getStreamEvents("world-1");
        expect(result).toHaveLength(1);
    });
});
