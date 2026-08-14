import { IDomainEvent } from "@nova-x-ai/core";
import { PluginId } from "../ValueObjects/PluginId";

export class PluginDisabledEvent implements IDomainEvent {
    readonly eventType = "EVT_PLUGIN_PluginDisabled";
    readonly pluginId: PluginId;
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(pluginId: PluginId, timestamp: number, correlationId: string) {
        this.pluginId = pluginId;
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
