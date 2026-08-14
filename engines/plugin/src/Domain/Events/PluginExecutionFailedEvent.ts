import { IDomainEvent } from "@nova-x-ai/core";
import { PluginId } from "../ValueObjects/PluginId";

export class PluginExecutionFailedEvent implements IDomainEvent {
    readonly eventType = "EVT_PLUGIN_PluginExecutionFailed";
    readonly pluginId: PluginId;
    readonly method: string;
    readonly error: string;
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(pluginId: PluginId, method: string, error: string, timestamp: number, correlationId: string) {
        this.pluginId = pluginId;
        this.method = method;
        this.error = error;
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
