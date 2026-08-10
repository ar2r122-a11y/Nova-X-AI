export interface IWorldEngineAclTranslator {
    translateLocationPayload(externalPayload: unknown): { locationId: string; regionId: string; coordinate: { x: number; y: number; z: number }; metadata: Record<string, unknown> };
    translateCoordinateFormat(external: unknown): { x: number; y: number; z: number };
    translateMapFormat(externalMap: unknown): { regions: Record<string, { locations: unknown[] }> };
    translateIntegrationDto(externalDto: unknown): { command: string; payload: Record<string, unknown> };
    toInternalDto<T>(external: unknown, schemaVersion: string): T;
    validateExternalPayload(payload: unknown, schemaVersion: string): boolean;
}
