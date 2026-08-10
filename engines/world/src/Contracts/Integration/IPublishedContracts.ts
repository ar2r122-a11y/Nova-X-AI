export interface IPublishedContracts {
    readonly version: string;
    readonly worldStateContract: {
        readonly version: string;
        readonly schema: Record<string, unknown>;
    };
    readonly worldClockContract: {
        readonly version: string;
        readonly schema: Record<string, unknown>;
    };
    readonly spatialContextContract: {
        readonly version: string;
        readonly schema: Record<string, unknown>;
    };
    readonly environmentalContract: {
        readonly version: string;
        readonly schema: Record<string, unknown>;
    };
    readonly eventContracts: readonly {
        readonly eventType: string;
        readonly version: string;
        readonly schema: Record<string, unknown>;
    }[];
}
