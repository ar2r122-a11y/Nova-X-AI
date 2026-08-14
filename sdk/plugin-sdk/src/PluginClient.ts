import type { IEventBus } from "@nova-x-ai/core";

export interface PluginClient {
    readonly eventBus: IEventBus;
    publishEvent(event: unknown): Promise<void>;
    executeHook(hookName: string, payload: unknown): Promise<void>;
    getCapabilities(): string[];
    getResourceBudget(): PluginResourceBudget;
}

export interface PluginResourceBudget {
    readonly maxMemoryBytes: number;
    readonly maxCpuMs: number;
    readonly maxStorageBytes: number;
    readonly usedMemoryBytes: number;
    readonly usedCpuMs: number;
    readonly usedStorageBytes: number;
}

export interface PluginHostCapabilities {
    readonly canPublishEvents: boolean;
    readonly canExecuteHooks: boolean;
    readonly canAccessStorage: boolean;
    readonly canAccessNetwork: boolean;
}

export interface PluginHookDefinition {
    readonly name: string;
    readonly description: string;
    readonly payloadSchema: Record<string, unknown>;
}

export class DefaultPluginClient implements PluginClient {
    readonly eventBus: IEventBus;
    private capabilities: string[];
    private budget: PluginResourceBudget;
    private hostCapabilities: PluginHostCapabilities;

    constructor(eventBus: IEventBus, capabilities: string[], budget: PluginResourceBudget, hostCapabilities: PluginHostCapabilities) {
        this.eventBus = eventBus;
        this.capabilities = capabilities;
        this.budget = budget;
        this.hostCapabilities = hostCapabilities;
    }

    async publishEvent(event: unknown): Promise<void> {
        if (!this.hostCapabilities.canPublishEvents) {
            throw new Error("Plugin does not have permission to publish events.");
        }
        await this.eventBus.publish(event as any);
    }

    async executeHook(_hookName: string, _payload: unknown): Promise<void> {
        if (!this.hostCapabilities.canExecuteHooks) {
            throw new Error("Plugin does not have permission to execute hooks.");
        }
    }

    getCapabilities(): string[] {
        return [...this.capabilities];
    }

    getResourceBudget(): PluginResourceBudget {
        return { ...this.budget };
    }
}
