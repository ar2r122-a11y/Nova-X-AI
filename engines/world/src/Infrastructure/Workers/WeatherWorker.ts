import type { IWorldEngine } from "../../Contracts/IWorldEngine";
import type { RuntimeConfiguration } from "../../Contracts/Runtime/index";
import { BaseWorldWorker } from "./BaseWorldWorker";

export class WeatherWorker extends BaseWorldWorker {
    constructor() {
        super(30000);
    }

    getWorkerName(): string {
        return "WeatherWorker";
    }

    protected async tickImpl(): Promise<void> {
        const config = this.getConfig();
        if (!config.enableRealtimeWeatherSimulation) return;

        const engine = this.getEngine();
        const worldId = this.getWorldId().getValue();

        const state = await engine.getWorldState(worldId);
        if (!state || state.state !== "simulation_running") return;

        try {
            await engine.transitionWorldState(worldId, "environmental_shift");
            await engine.transitionWorldState(worldId, "simulation_running");
        } catch {
            await engine.updateWeather(worldId, "global", {
                temperatureCelsius: 20,
                precipitationMm: 0,
                windSpeedKmh: 10,
                cloudCoverPercent: 0,
                description: "clear"
            });
        }
    }
}
