import { IDomainEvent } from "@nova-x-ai/core";
import { PluginId } from "../ValueObjects/PluginId";

export class PluginSandboxCrashedEvent implements IDomainEvent {
    readonly eventType = "EVT_PLUGIN_SandboxCrashed";
    readonly pluginId: PluginId;
    readonly reason: string;
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(pluginId: PluginId, reason: string, timestamp: number, correlationId: string) {
        this.pluginId = pluginId;
        this.reason = reason;
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
