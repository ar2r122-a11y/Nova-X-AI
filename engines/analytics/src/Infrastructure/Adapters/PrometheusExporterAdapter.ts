export class PrometheusExporterAdapter {
    async export(_metrics: unknown[]): Promise<void> {
        console.warn("PrometheusExporterAdapter: export stub. Integrate with Prometheus registry.");
    }
}
