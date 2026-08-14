export interface IAnomalyDetector {
    detect(metrics: Array<{
        engineName: string;
        metricName: string;
        value: number;
        timestamp: number;
    }>): Promise<Array<{
        engineName: string;
        anomalyType: string;
        severity: "low" | "medium" | "high" | "critical";
        message: string;
        context: Record<string, unknown>;
    }>>;

    getUnresolved(): Promise<Array<{
        id: string;
        engineName: string;
        anomalyType: string;
        severity: string;
        message: string;
        detectedAt: number;
    }>>;

    resolve(id: string): Promise<void>;
}
