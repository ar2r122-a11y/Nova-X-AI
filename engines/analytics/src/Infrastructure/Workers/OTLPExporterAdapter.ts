export class OTLPExporterAdapter {
    async export(_metrics: unknown[]): Promise<void> {
        console.warn("OTLPExporterAdapter: export stub. Integrate with OpenTelemetry OTLP exporter.");
    }
}
