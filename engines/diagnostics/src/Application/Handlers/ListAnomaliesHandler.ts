import type { IQueryHandler } from "@nova-x-ai/core";
import type { ListAnomaliesQuery } from "../Queries/ListAnomaliesQuery";
import type { AnomalyDetectionResultDto } from "../DTOs/AnomalyDetectionResultDto";

export class ListAnomaliesHandler implements IQueryHandler<ListAnomaliesQuery, AnomalyDetectionResultDto[]> {
    constructor(
        private readonly anomalyDetector: {
            getUnresolved(): Promise<Array<{
                id: string;
                engineName: string;
                anomalyType: string;
                severity: string;
                message: string;
                detectedAt: number;
            }>>;
        }
    ) {}

    public async handle(query: ListAnomaliesQuery): Promise<AnomalyDetectionResultDto[]> {
        const anomalies = await this.anomalyDetector.getUnresolved();

        return anomalies
            .filter(a => !query.engineName || a.engineName === query.engineName)
            .filter(a => query.resolved === undefined || query.resolved === false)
            .map(a => ({
                id: a.id,
                engineName: a.engineName,
                anomalyType: a.anomalyType,
                severity: a.severity as "low" | "medium" | "high" | "critical",
                message: a.message,
                detectedAt: a.detectedAt,
                context: {},
                resolved: false
            }));
    }
}
