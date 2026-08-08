export interface ModuleStatusDto {
    moduleName: string;

    version: string;

    status:
        | "registered"
        | "initializing"
        | "running"
        | "stopped"
        | "failed";

    healthy: boolean;

    correlationId: string;
}