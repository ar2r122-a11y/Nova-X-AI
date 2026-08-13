import { PurgeCommand } from "../Commands/PurgeCommand";
import { PurgeResultDto } from "../DTO/PurgeResultDto";
import type { IMetricRepository } from "../../Domain/Repositories/IMetricRepository";
import type { ITelemetryEventRepository } from "../../Domain/Repositories/ITelemetryEventRepository";

export class PurgeCommandHandler {
    constructor(
        private readonly metricRepository: IMetricRepository,
        private readonly telemetryEventRepository: ITelemetryEventRepository
    ) {}

    async handle(command: PurgeCommand): Promise<PurgeResultDto> {
        if (command.olderThanDays <= 0) {
            throw new Error("olderThanDays must be a positive number.");
        }

        const cutoff = Date.now() - command.olderThanDays * 24 * 60 * 60 * 1000;
        const metricsPurged = await this.metricRepository.deleteExpired(cutoff);
        const telemetryPurged = await this.telemetryEventRepository.deleteExpired(cutoff);

        return new PurgeResultDto(metricsPurged, telemetryPurged, Date.now());
    }
}
