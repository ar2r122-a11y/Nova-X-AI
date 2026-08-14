import { PluginId } from "../ValueObjects/PluginId";
import { PluginVersion } from "../ValueObjects/PluginVersion";
import { PluginStatus } from "../ValueObjects/PluginStatus";
import { PluginCapability } from "../ValueObjects/PluginCapability";

export interface PluginEntityProps {
    pluginId: PluginId;
    name: string;
    version: PluginVersion;
    status: PluginStatus;
    capabilities: PluginCapability[];
    manifest: Record<string, unknown>;
    installedAt: number;
    lastActiveAt: number;
    failureCount: number;
    recoveryAttempts: number;
}

export class PluginEntity {
    private readonly props: PluginEntityProps;

    private constructor(props: PluginEntityProps) {
        this.props = props;
    }

    static create(props: Omit<PluginEntityProps, "installedAt" | "lastActiveAt" | "failureCount" | "recoveryAttempts">): PluginEntity {
        const now = Date.now();
        return new PluginEntity({
            ...props,
            installedAt: now,
            lastActiveAt: now,
            failureCount: 0,
            recoveryAttempts: 0,
        });
    }

    static reconstitute(props: PluginEntityProps): PluginEntity {
        return new PluginEntity(props);
    }

    getPluginId(): PluginId {
        return this.props.pluginId;
    }

    getName(): string {
        return this.props.name;
    }

    getVersion(): PluginVersion {
        return this.props.version;
    }

    getStatus(): PluginStatus {
        return this.props.status;
    }

    getCapabilities(): PluginCapability[] {
        return this.props.capabilities;
    }

    getManifest(): Record<string, unknown> {
        return this.props.manifest;
    }

    getInstalledAt(): number {
        return this.props.installedAt;
    }

    getLastActiveAt(): number {
        return this.props.lastActiveAt;
    }

    getFailureCount(): number {
        return this.props.failureCount;
    }

    getRecoveryAttempts(): number {
        return this.props.recoveryAttempts;
    }

    markActive(): void {
        this.props.status = PluginStatus.Active;
        this.props.lastActiveAt = Date.now();
    }

    markCrashed(): void {
        this.props.status = PluginStatus.Crashed;
        this.props.failureCount += 1;
    }

    markRecovering(): void {
        this.props.status = PluginStatus.Recovering;
        this.props.recoveryAttempts += 1;
    }

    incrementFailure(): void {
        this.props.failureCount += 1;
    }

    toSnapshot(): PluginEntityProps {
        return { ...this.props };
    }
}
