export class OpenTelemetryExporterAdapter {
    async export(_metrics: unknown[]): Promise<void> {
        console.warn("OpenTelemetryExporterAdapter: export stub. Integrate with OTLP exporter.");
    }
}
