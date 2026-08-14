import { IDomainEvent } from "@nova-x-ai/core";
import { PluginId } from "../ValueObjects/PluginId";

export class PluginUpdatedEvent implements IDomainEvent {
    readonly eventType = "EVT_PLUGIN_PluginUpdated";
    readonly pluginId: PluginId;
    readonly previousVersion: string;
    readonly newVersion: string;
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(pluginId: PluginId, previousVersion: string, newVersion: string, timestamp: number, correlationId: string) {
        this.pluginId = pluginId;
        this.previousVersion = previousVersion;
        this.newVersion = newVersion;
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
