import type { IWorldEngineAclTranslator } from "../../Contracts/Integration/IWorldEngineAclTranslator";

export class WorldEngineAclTranslator implements IWorldEngineAclTranslator {
    translateLocationPayload(externalPayload: unknown): { locationId: string; regionId: string; coordinate: { x: number; y: number; z: number }; metadata: Record<string, unknown> } {
        const record = externalPayload as Record<string, unknown>;
        const coord = record.coordinate as Record<string, unknown> | undefined;
        return {
            locationId: String(record.locationId ?? record.id ?? ""),
            regionId: String(record.regionId ?? record.region ?? ""),
            coordinate: {
                x: Number(coord?.x ?? record.x ?? 0),
                y: Number(coord?.y ?? record.y ?? 0),
                z: Number(coord?.z ?? record.z ?? 0)
            },
            metadata: (record.metadata ?? {}) as Record<string, unknown>
        };
    }

    translateCoordinateFormat(external: unknown): { x: number; y: number; z: number } {
        const record = external as Record<string, unknown>;
        return {
            x: Number(record.x ?? 0),
            y: Number(record.y ?? 0),
            z: Number(record.z ?? 0)
        };
    }

    translateMapFormat(externalMap: unknown): { regions: Record<string, { locations: unknown[] }> } {
        const record = externalMap as Record<string, unknown>;
        return {
            regions: (record.regions ?? {}) as Record<string, { locations: unknown[] }>
        };
    }

    translateIntegrationDto(externalDto: unknown): { command: string; payload: Record<string, unknown> } {
        const record = externalDto as Record<string, unknown>;
        return {
            command: String(record.command ?? record.type ?? ""),
            payload: (record.payload ?? record.data ?? {}) as Record<string, unknown>
        };
    }

    toInternalDto<T>(_external: unknown, _schemaVersion: string): T {
        throw new Error("ACL translation to internal DTO requires schema registry.");
    }

    validateExternalPayload(payload: unknown, _schemaVersion: string): boolean {
        return typeof payload === "object" && payload !== null;
    }
}
