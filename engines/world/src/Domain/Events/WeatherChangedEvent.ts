import { IDomainEvent } from "@nova-x-ai/core";

export class WeatherChangedEvent implements IDomainEvent {
    readonly eventType = "EVT_WORLD_WeatherChanged";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly worldId: string,
        public readonly regionId: string,
        public readonly previousWeather: string,
        public readonly newWeather: string,
        public readonly previousTemperature: number,
        public readonly newTemperature: number,
        timestamp: number,
        correlationId: string
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
