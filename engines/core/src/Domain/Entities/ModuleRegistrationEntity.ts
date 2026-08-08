import { CorrelationId } from "../value-objects/CorrelationId";
import { ModuleVersion } from "../value-objects/ModuleVersion";

export type ModuleStatus =
    | "registered"
    | "initializing"
    | "running"
    | "stopped"
    | "failed";

export class ModuleRegistrationEntity {
    public readonly id: CorrelationId;

    public readonly moduleName: string;

    public readonly version: ModuleVersion;

    private status: ModuleStatus;

    constructor(
        id: CorrelationId,
        moduleName: string,
        version: ModuleVersion
    ) {
        if (!moduleName.trim()) {
            throw new Error("Module name cannot be empty.");
        }

        this.id = id;
        this.moduleName = moduleName;
        this.version = version;
        this.status = "registered";
    }

    public getStatus(): ModuleStatus {
        return this.status;
    }

    public setStatus(status: ModuleStatus): void {
        this.status = status;
    }

    public isRunning(): boolean {
        return this.status === "running";
    }

    public isFailed(): boolean {
        return this.status === "failed";
    }
}