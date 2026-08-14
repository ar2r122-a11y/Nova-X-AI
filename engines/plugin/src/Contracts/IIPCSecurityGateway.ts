export interface IIPCSecurityGateway {
    validateMessage(schema: Record<string, unknown>, message: unknown): boolean;
    enforceCapability(pluginId: string, capability: string, action: string): boolean;
}
